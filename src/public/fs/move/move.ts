import path from 'path';
import fs from 'fs-extra';
import { absolute, exists } from '~/utils/file';
import { IFsUpdateOptions } from '../types';
import confirm from '~/utils/confirm';
import logger from '~/utils/logger';

export default async function move(
  src: string | string[],
  dest: string,
  options: IFsUpdateOptions = {}
): Promise<void> {
  options = Object.assign({ overwrite: true }, options);

  if (Array.isArray(src)) {
    // Check dest is a folder
    if (await exists(dest)) {
      const stat = await fs.stat(dest);
      if (!stat.isDirectory()) {
        throw Error('Destination must be a folder for an array of sources');
      }
    }
    for (let source of src) {
      await each(source, path.join(dest, path.parse(source).base), options);
    }
  } else {
    await each(src, dest, options);
  }
}

export async function each(
  src: string,
  dest: string,
  options: IFsUpdateOptions
): Promise<void> {
  const cwd = process.cwd();
  src = absolute({ path: src, cwd });
  dest = absolute({ path: dest, cwd });

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
