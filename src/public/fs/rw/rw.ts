import path from 'path';
import fs from 'fs-extra';
import { exists, absolute } from '~/utils/file';
import confirm from '~/utils/confirm';
import { IFsUpdateOptions, TContentFn } from '../types';
import { open } from '~/utils/errors';
import { log } from '../utils';

export default async function rw(
  file: string | string[],
  fn: TContentFn,
  options: IFsUpdateOptions = {}
): Promise<void> {
  options = Object.assign({ overwrite: true }, options);

  Array.isArray(file)
    ? await Promise.all(file.map((item) => each(item, fn, options)))
    : await each(file, fn, options);
}

export async function each(
  file: string,
  fn: TContentFn,
  options: IFsUpdateOptions
): Promise<void> {
  const cwd = process.cwd();
  file = absolute({ path: file, cwd });
  const relative = './' + path.relative(cwd, file);
  const doesExist = await exists(file, { fail: options.fail });
  const raw = doesExist ? await fs.readFile(file).then(String) : undefined;

  let response: string | void;
  try {
    response = await fn({ file, raw });
  } catch (e) {
    throw open(e);
  }

  if (response === undefined || (doesExist && !options.overwrite)) {
    log(options, 'info')(`Write skipped: ${relative}`);
    return;
  }

  if (!(await confirm(`Write "${relative}"?`, options))) return;

  await fs.ensureDir(path.parse(file).dir);
  await fs.writeFile(file, String(response));
  log(options, 'info')(`Written: ${relative}`);
}
