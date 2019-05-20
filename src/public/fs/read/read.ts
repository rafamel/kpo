import fs from 'fs-extra';
import { exists, absolute } from '~/utils/file';
import { IFsReadOptions } from '../types';
import { TScript } from '~/types';

export default async function read(
  file: string | string[],
  fn: (raw?: string) => TScript,
  options: IFsReadOptions = {}
): Promise<TScript> {
  return Array.isArray(file)
    ? Promise.all(file.map((item) => each(item, fn, options)))
    : each(file, fn, options);
}

export async function each(
  file: string,
  fn: (raw?: string) => TScript,
  options: IFsReadOptions
): Promise<TScript> {
  const cwd = process.cwd();
  file = absolute({ path: file, cwd });
  const doesExist = await exists(file, { fail: options.fail });
  const raw = doesExist ? await fs.readFile(file).then(String) : undefined;

  return fn(raw);
}
