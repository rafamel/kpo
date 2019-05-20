import path from 'path';
import fs from 'fs-extra';
import { exists } from '~/utils/file';
import confirm from '~/utils/confirm';
import { IFsUpdateOptions, TReadWriteFn, TDestination } from '../types';
import { open } from '~/utils/errors';
import { log, resolver } from '../utils';

export default async function rw(
  src: string | string[],
  dest: TDestination,
  fn: TReadWriteFn,
  options: IFsUpdateOptions = {}
): Promise<void> {
  options = Object.assign({ overwrite: true }, options);
  await resolver(src, dest, (src, dest) => each(src, dest, fn, options));
}

export async function each(
  src: string,
  dest: string,
  fn: TReadWriteFn,
  options: IFsUpdateOptions
): Promise<void> {
  const cwd = process.cwd();
  const relative = './' + path.relative(cwd, dest);
  const doesExist = await exists(src, { fail: options.fail });
  const raw = doesExist ? await fs.readFile(src).then(String) : undefined;

  let response: string | void;
  try {
    response = await fn({ src, dest, raw });
  } catch (e) {
    throw open(e);
  }

  if (response === undefined || (doesExist && !options.overwrite)) {
    log(options, 'info')(`Write skipped: ${relative}`);
    return;
  }

  if (!(await confirm(`Write "${relative}"?`, options))) return;

  await fs.ensureDir(path.dirname(dest));
  await fs.writeFile(dest, String(response));
  log(options, 'info')(`Written: ${relative}`);
}
