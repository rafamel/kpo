/* eslint-disable eqeqeq */
import path from 'path';
import fs from 'fs-extra';
import { absolute, exists } from '~/utils/file';
import { IFsUpdateOptions, TDestination } from '../types';
import confirm from '~/utils/confirm';
import logger from '~/utils/logger';

export default async function move(
  src: string | string[],
  dest: TDestination,
  options: IFsUpdateOptions = {}
): Promise<void> {
  const cwd = process.cwd();
  options = Object.assign({ overwrite: true }, options);

  let { from, to } =
    typeof dest === 'string' ? { from: undefined, to: dest } : dest;

  if (!Array.isArray(src) && typeof dest === 'string') {
    return each(
      absolute({ path: src, cwd }),
      absolute({ path: to, cwd }),
      options
    );
  }

  to = absolute({ path: to, cwd });
  if (from != undefined) from = absolute({ path: from, cwd });
  if (!Array.isArray(src)) src = [src].filter(Boolean);
  // Check dest is a folder
  if (await exists(to)) {
    const stat = await fs.stat(to);
    if (!stat.isDirectory()) {
      throw Error(
        'Destination must be a folder if an array of sources or a from/to destination map are passed'
      );
    }
  }
  const items = src.map((source) => {
    source = absolute({ path: source, cwd });
    let destination = path.join(to, path.parse(source).base);
    if (from != undefined) {
      const relative = path.relative(from, source);
      if (relative.slice(0, 2) === '..') {
        throw Error(`All source files must be within 'from'`);
      }
      destination = path.join(to, relative);
    }

    return { source, destination };
  });

  for (let { source, destination } of items) {
    await each(source, destination, options);
  }
}

export async function each(
  src: string,
  dest: string,
  options: IFsUpdateOptions
): Promise<void> {
  const cwd = process.cwd();
  const relatives = {
    src: './' + path.relative(cwd, src),
    dest: './' + path.relative(cwd, dest)
  };

  const srcExist = await exists(src, { fail: options.fail });
  if (!srcExist) {
    logger.info(`Move skipped: "${relatives.src}" to "${relatives.dest}"`);
    return;
  }

  const destExists = await exists(dest);
  if (destExists) {
    if (options.fail) {
      throw Error(`Destination already exists: ${relatives.dest}`);
    }
    if (!options.overwrite) {
      logger.info(`Move skipped: "${relatives.src}" to "${relatives.dest}"`);
      return;
    }
  }

  const msg = `Move "${relatives.src}" to "${relatives.dest}"?`;
  if (!(await confirm(msg, options))) return;

  await fs.move(src, dest, { overwrite: options.overwrite });
  logger.info(`Moved: "${relatives.src}" to "${relatives.dest}"`);
}
