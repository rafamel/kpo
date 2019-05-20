import path from 'path';
import fs from 'fs-extra';
import { exists } from '~/utils/file';
import { IFsUpdateOptions, TCopyFilterFn, TDestination } from '../types';
import confirm from '~/utils/confirm';
import { log, resolver } from '../utils';
import { open } from '~/utils/errors';

export default async function copy(
  src: string | string[],
  dest: TDestination,
  options: IFsUpdateOptions = {},
  filter: TCopyFilterFn = () => true
): Promise<void> {
  options = Object.assign({ overwrite: true }, options);

  await resolver(src, dest, (src, dest) => each(src, dest, options, filter));
}

export async function each(
  src: string,
  dest: string,
  options: IFsUpdateOptions,
  filter: TCopyFilterFn
): Promise<void> {
  const cwd = process.cwd();
  const relatives = {
    src: './' + path.relative(cwd, src),
    dest: './' + path.relative(cwd, dest)
  };

  const srcExist = await exists(src, { fail: options.fail });
  if (!srcExist) {
    log(options, 'info')(
      `Copy skipped: "${relatives.src}" to "${relatives.dest}"`
    );
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
  log(options, 'info')(`Copied: "${relatives.src}" to "${relatives.dest}"`);
}
