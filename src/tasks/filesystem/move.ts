import { Task, Context } from '../../definitions';
import { getPathPairs, usePair } from '../../helpers/paths';
import { isCancelled } from '../../utils/is-cancelled';
import { log } from '../stdio/log';
import { into } from 'pipettes';
import fs from 'fs-extra';

export interface MoveOptions {
  /** Parse globs in paths */
  glob?: boolean;
  /** Whether to treat the destination as an exact path for a single source */
  single?: boolean;
  /** Disallows non existent paths and an empty set of paths */
  strict?: boolean;
  /** Whether to error, ignore, or overwrite existing files */
  exists?: 'error' | 'ignore' | 'overwrite';
}

/**
 * Moves files or directories from `paths` to `destination`.
 * Treats `destination` as a folder unless `options.single` is `true`.
 * @returns Task
 */
export function move(
  paths: string | string[],
  destination: string,
  options?: MoveOptions
): Task.Async {
  return async (ctx: Context): Promise<void> => {
    into(ctx, log('debug', 'Move', paths, 'to', destination));

    const opts = Object.assign(
      { glob: false, single: false, strict: false, exists: 'error' },
      options
    );
    const pairs = await getPathPairs(paths, destination, ctx, {
      glob: opts.glob,
      single: opts.single,
      strict: opts.strict
    });

    for (const pair of pairs) {
      if (await isCancelled(ctx)) return;
      await usePair(
        pair,
        ctx,
        { strict: opts.strict, exists: opts.exists },
        ([src, dest]) => {
          return fs.move(src, dest, {
            overwrite: opts.exists === 'overwrite'
          });
        }
      );
    }
  };
}
