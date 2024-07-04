import path from 'node:path';

import type { UnaryFn } from 'type-core';
import fs from 'fs-extra';
import { glob } from 'glob';

import type { Context } from '../definitions';
import { isCancelled } from '../utils/cancellation';
import { log } from '../tasks/stdio/log';
import { run } from '../utils/run';

export async function usePair(
  pair: [string, string],
  context: Context,
  options: { strict: boolean; exists: 'error' | 'ignore' | 'overwrite' },
  cb: UnaryFn<[string, string], Promise<void>>
): Promise<void> {
  return useSource(pair[0], context, { strict: options.strict }, (source) => {
    return useDestination(
      pair[1],
      context,
      { exists: options.exists },
      (destination) => cb([source, destination])
    );
  });
}

export async function useSource(
  source: string,
  context: Context,
  options: { strict: boolean },
  cb: UnaryFn<string, Promise<void>>
): Promise<void> {
  const src = getAbsolutePath(source, context);
  const exists = await fs.pathExists(src);
  if (isCancelled(context)) return;

  if (exists) return cb(src);
  if (options.strict) {
    throw new Error(`Source path doesn't exist: ${src}`);
  }
  await run(context, log('debug', 'Ignore source:', src));
}

export async function useDestination(
  destination: string,
  context: Context,
  options: { exists: 'error' | 'ignore' | 'overwrite' },
  cb: UnaryFn<string, Promise<void>>
): Promise<void> {
  const dest = getAbsolutePath(destination, context);
  if (options.exists === 'overwrite') return cb(dest);

  const exists = await fs.pathExists(dest);

  if (isCancelled(context)) return;
  if (!exists) return cb(dest);

  if (options.exists === 'ignore') {
    await run(context, log('debug', 'Ignore destination:', dest));
  } else {
    throw new Error(`Destination exists: ${dest}`);
  }
}

export async function getPathPairs(
  paths: string | string[],
  destination: string,
  context: Context,
  options: {
    single: boolean;
    glob: boolean;
    strict: boolean;
    from: string | null;
  }
): Promise<Array<[string, string]>> {
  const from = options.from;
  const dest = getAbsolutePath(destination, context);
  const arr = Array.isArray(paths) ? paths : [paths];
  const sources = await getPaths(
    arr.map((x) => path.resolve(from || './', x)),
    context,
    options
  );

  if (options.single) {
    if (sources.length > 1) {
      throw new Error(`Multiple sources provided for single mode`);
    }
    if (!from) return [[sources[0], dest]];
  }

  const destExists = await fs.pathExists(dest);
  const isDestDir = destExists
    ? await fs.stat(dest).then((x) => x.isDirectory())
    : false;
  if (!isDestDir) {
    throw new Error(`Destination path is not a directory: ${dest}`);
  }

  if (!from) {
    return sources.map((source) => [
      source,
      path.join(dest, path.basename(source))
    ]);
  }

  const fromExists = await fs.pathExists(from);
  const isFromDir = fromExists
    ? await fs.stat(from).then((x) => x.isDirectory())
    : false;
  if (!isFromDir) {
    throw new Error(`Options.from path is not a directory: ${from}`);
  }

  const absoluteFrom = getAbsolutePath(from, context);
  return sources.map((source) => {
    if (!source.startsWith(absoluteFrom)) {
      throw new Error(
        `Sources must all be children of Options.from: ${source}`
      );
    }
    return [source, path.join(dest, source.substring(absoluteFrom.length))];
  });
}

export async function getPaths(
  input: string | string[],
  context: Context,
  options: { glob: boolean; strict: boolean }
): Promise<string[]> {
  const arr = Array.isArray(input) ? input : [input];
  const abs = arr
    .map((x) => getAbsolutePath(x, context))
    .filter((x, i, arr) => Boolean(x) && arr.indexOf(x) === i);

  if (!abs.length || !options.glob) return abs;

  const response =
    !abs.length || !options.glob
      ? abs
      : await abs
          .reduce((acc: Promise<string[]>, pattern) => {
            return acc.then(async (arr) => {
              const results = await glob(pattern, {
                nodir: false,
                absolute: true
              });
              return arr.concat(results);
            });
          }, Promise.resolve([]))
          .then((arr) => arr.filter((x, i, arr) => arr.indexOf(x) === i));

  if (!response.length && options.strict) {
    throw new Error(`Empty source set: no available sources provided`);
  }

  return response;
}

export function getAbsolutePath(input: string, context: Context): string {
  return path.resolve(context.cwd, input);
}
