import fs from 'fs-extra';
import path from 'path';
import { IFsUpdateOptions, TContentFn } from '../types';
import { exists, absolute } from '~/utils/file';
import confirm from '~/utils/confirm';
import { open } from '~/utils/errors';
import { log } from '../utils';

export default async function write(
  file: string | string[],
  raw?: string | TContentFn,
  options: IFsUpdateOptions = {}
): Promise<void> {
  options = Object.assign({ overwrite: true }, options);

  Array.isArray(file)
    ? await Promise.all(file.map((item) => each(item, raw, options)))
    : await each(file, raw, options);
}

export async function each(
  file: string,
  raw: void | string | TContentFn,
  options: IFsUpdateOptions
): Promise<void> {
  const cwd = process.cwd();
  file = absolute({ path: file, cwd });
  const relative = './' + path.relative(process.cwd(), file);

  if (typeof raw === 'function') {
    try {
      raw = await raw({ file });
    } catch (err) {
      throw open(err);
    }
  }

  const doesExist = await exists(file);
  if (options.fail && doesExist) {
    throw Error(`File already exists: ${relative}`);
  }

  if (doesExist && !options.overwrite) {
    log(options, 'info')(`Write skipped: ${relative}`);
    return;
  }

  if (!(await confirm(`Write "${relative}"?`, options))) return;

  await fs.ensureDir(path.parse(file).dir);
  await fs.writeFile(file, raw ? String(raw) : '');
  log(options, 'info')(`Written: ${relative}`);
}
