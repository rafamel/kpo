import fs from 'fs-extra';
import { exists, absolute } from '~/utils/file';
import { IFsReadOptions, TReadFn } from '../types';
import { TScript } from '~/types';

export default async function read(
  src: string | string[],
  fn: TReadFn,
  options: IFsReadOptions = {}
): Promise<TScript> {
  return Array.isArray(src)
    ? Promise.all(src.map((file) => each(file, fn, options)))
    : each(src, fn, options);
}

export async function each(
  src: string,
  fn: TReadFn,
  options: IFsReadOptions
): Promise<TScript> {
  const cwd = process.cwd();
  src = absolute({ path: src, cwd });
  const doesExist = await exists(src, { fail: options.fail });
  const raw = doesExist ? await fs.readFile(src).then(String) : undefined;

  return fn({ src, raw });
}
