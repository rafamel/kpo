import fs from 'fs-extra';
import path from 'path';
import { IFsUpdateOptions, TWriteFn } from '../types';
import { exists, absolute } from '~/utils/file';
import confirm from '~/utils/confirm';
import { open } from '~/utils/errors';
import { log } from '../utils';

export default async function write(
  dest: string | string[],
  content?: string | TWriteFn,
  options: IFsUpdateOptions = {}
): Promise<void> {
  options = Object.assign({ overwrite: true }, options);

  Array.isArray(dest)
    ? await Promise.all(dest.map((file) => each(file, content, options)))
    : await each(dest, content, options);
}

export async function each(
  dest: string,
  content: void | string | TWriteFn,
  options: IFsUpdateOptions
): Promise<void> {
  const cwd = process.cwd();
  dest = absolute({ path: dest, cwd });
  const relative = './' + path.relative(process.cwd(), dest);

  if (typeof content === 'function') {
    try {
      content = await content({ dest });
    } catch (err) {
      throw open(err);
    }
  }

  const doesExist = await exists(dest);
  if (options.fail && doesExist) {
    throw Error(`File already exists: ${relative}`);
  }

  if (doesExist && !options.overwrite) {
    log(options, 'info')(`Write skipped: ${relative}`);
    return;
  }

  if (!(await confirm(`Write "${relative}"?`, options))) return;

  await fs.ensureDir(path.dirname(dest));
  await fs.writeFile(dest, content ? String(content) : '');
  log(options, 'info')(`Written: ${relative}`);
}
