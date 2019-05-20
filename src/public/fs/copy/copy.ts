import path from 'path';
import fs from 'fs-extra';
import { absolute, exists } from '~/utils/file';
import { IFsUpdateOptions, TCopyFilterFn } from '../types';
import confirm from '~/utils/confirm';
import logger from '~/utils/logger';
import { open } from '~/utils/errors';

// TODO allow to take an option to duplicate folder structure on dest from a base + don't allow it when src is upwards instead of nested in that folder

export default async function copy(
  src: string | string[],
  dest: string,
  options: IFsUpdateOptions = {},
  filter: TCopyFilterFn = () => true
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
      await each(
        source,
        path.join(dest, path.parse(source).base),
        options,
        filter
      );
    }
  } else {
    await each(src, dest, options, filter);
  }
}

export async function each(
  src: string,
  dest: string,
  options: IFsUpdateOptions,
  filter: TCopyFilterFn
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
    logger.info(`Copy skipped: "${relatives.src}" to "${relatives.dest}"`);
    return;
  }

  const msg = `Copy "${relatives.src}" to "${relatives.dest}"?`;
  if (!(await confirm(msg, options))) return;

  await fs.copy(src, dest, {
    overwrite: options.overwrite,
    errorOnExist: options.fail,
    async filter(src: string, dest: string): Promise<boolean> {
      try {
        return await filter(src, dest);
      } catch (err) {
        throw open(err);
      }
    }
  });
  logger.info(`Copied: "${relatives.src}" to "${relatives.dest}"`);
}
