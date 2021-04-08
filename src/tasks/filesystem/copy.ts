import { Task, Context } from '../../definitions';
import { getPathPairs, usePair } from '../../helpers/paths';
import { isCancelled } from '../../utils/is-cancelled';
import { series } from '../aggregate/series';
import { log } from '../stdio/log';
import { shallow } from 'merge-strategies';
import fs from 'fs-extra';

export interface CopyOptions {
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
 * Copies files or directories from `paths` to `destination`.
 * Treats `destination` as a folder unless `options.single` is `true`.
 * @returns Task
 */
export function copy(
  paths: string | string[],
  destination: string,
  options?: CopyOptions
): Task.Async {
  return series(
    log('debug', 'Copy', paths, 'to', destination),
    async (ctx: Context): Promise<void> => {
      const opts = shallow(
        { glob: false, single: false, strict: false, exists: 'error' },
        options || undefined
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
            return fs.copy(src, dest, {
              overwrite: true,
              errorOnExist: true,
              dereference: false,
              preserveTimestamps: false
            });
          }
        );
      }
    }
  );
}
