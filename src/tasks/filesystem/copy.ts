import { shallow } from 'merge-strategies';
import fs from 'fs-extra';

import type { Context, Task } from '../../definitions';
import { getPathPairs, usePair } from '../../helpers/paths';
import { isCancelled } from '../../utils/cancellation';
import { series } from '../aggregate/series';
import { log } from '../stdio/log';

export interface CopyOptions {
  /** Parse globs in paths */
  glob?: boolean;
  /** Whether to treat the destination as an exact path for a single source */
  single?: boolean;
  /** Disallows non existent paths and an empty set of paths */
  strict?: boolean;
  /** Whether to error, ignore, or overwrite existing files */
  exists?: 'error' | 'ignore' | 'overwrite';
  /** Absolute path, or relative to the cwd, to resolve paths from; if not null, the source folder structure will be replicated on destination */
  from?: string | null;
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
        {
          glob: false,
          single: false,
          strict: false,
          exists: 'error',
          from: null
        },
        options || undefined
      );
      const pairs = await getPathPairs(paths, destination, ctx, {
        glob: opts.glob,
        single: opts.single,
        strict: opts.strict,
        from: opts.from
      });

      for (const pair of pairs) {
        if (isCancelled(ctx)) return;

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
