import path from 'path';
import fs from 'fs-extra';
import { exists } from '~/utils/file';
import { IFsUpdateOptions, TDestination } from '../types';
import confirm from '~/utils/confirm';
import { log, resolver } from '../utils';

export default async function move(
  src: string | string[],
  dest: TDestination,
  options: IFsUpdateOptions = {}
): Promise<void> {
  options = Object.assign({ overwrite: true }, options);

  await resolver(src, dest, (src, dest) => each(src, dest, options));
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
    log(options, 'info')(
      `Move skipped: "${relatives.src}" to "${relatives.dest}"`
    );
    return;
  }

  const destExists = await exists(dest);
  if (destExists) {
    if (options.fail) {
      throw Error(`Destination already exists: ${relatives.dest}`);
    }
    if (!options.overwrite) {
      log(options, 'info')(
        `Move skipped: "${relatives.src}" to "${relatives.dest}"`
      );
      return;
    }
  }

  const msg = `Move "${relatives.src}" to "${relatives.dest}"?`;
  if (!(await confirm(msg, options))) return;

  await fs.move(src, dest, { overwrite: options.overwrite });
  log(options, 'info')(`Moved: "${relatives.src}" to "${relatives.dest}"`);
}
