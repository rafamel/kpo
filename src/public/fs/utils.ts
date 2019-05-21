/* eslint-disable eqeqeq */
import fs from 'fs-extra';
import path from 'path';
import { series } from 'promist';
import { absolute, exists } from '~/utils/file';
import logger from '~/utils/logger';
import { IFsReadOptions, TDestination } from './types';

export function log(
  options: IFsReadOptions,
  level: 'trace' | 'debug' | 'info' | 'warn' | 'error'
): (...args: any[]) => void {
  return (...args) => {
    if (!options.hasOwnProperty('logger')) return logger[level](...args);
    if (options.logger) logger[level](...args);
  };
}

export async function resolver<T>(
  src: string | string[],
  dest: TDestination,
  fn: (src: string, dest: string) => Promise<T>
): Promise<T | T[]> {
  const cwd = process.cwd();
  let { from, to } =
    typeof dest === 'string' ? { from: undefined, to: dest } : dest;

  if (!Array.isArray(src) && typeof dest === 'string') {
    return fn(absolute({ path: src, cwd }), absolute({ path: to, cwd }));
  }

  to = absolute({ path: to, cwd });
  if (from != undefined) from = absolute({ path: from, cwd });
  if (!Array.isArray(src)) src = [src].filter(Boolean);

  // Check dest is a folder
  if (await exists(to)) {
    const stat = await fs.stat(to);
    if (!stat.isDirectory()) {
      throw Error(
        'Destination must be a folder if an array of sources or a from/to destination map are passed'
      );
    }
  }

  const items = src.map((source) => {
    source = absolute({ path: source, cwd });
    let destination = path.join(to, path.parse(source).base);
    if (from != undefined) {
      const relative = path.relative(from, source);
      if (relative.slice(0, 2) === '..') {
        throw Error(`All source files must be within 'from'`);
      }
      destination = path.join(to, relative);
    }

    return { source, destination };
  });

  return series.map(items, ({ source, destination }) =>
    fn(source, destination)
  );
}
