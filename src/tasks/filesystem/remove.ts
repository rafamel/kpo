import { shallow } from 'merge-strategies';
import fs from 'fs-extra';

import type { Context, Task } from '../../definitions';
import { getPaths, useSource } from '../../helpers/paths';
import { isCancelled } from '../../utils/cancellation';
import { series } from '../aggregate/series';
import { log } from '../stdio/log';

export interface RemoveOptions {
  /** Parse globs in paths */
  glob?: boolean;
  /** Disallows non existent paths and an empty set of paths */
  strict?: boolean;
  /** Remove files recursively */
  recursive?: boolean;
}

/**
 * Removes files or directories as specified in `paths`.
 * @returns Task
 */
export function remove(
  paths: string | string[],
  options?: RemoveOptions
): Task.Async {
  return series(
    log('debug', 'Remove:', paths),
    async (ctx: Context): Promise<void> => {
      const opts = shallow(
        { glob: false, strict: false, recursive: false },
        options || undefined
      );
      const sources = await getPaths(paths, ctx, {
        glob: opts.glob,
        strict: opts.strict
      });

      for (const source of sources) {
        if (isCancelled(ctx)) return;

        await useSource(source, ctx, { strict: opts.strict }, (source) => {
          return opts.recursive
            ? fs.remove(source)
            : fs
                .stat(source)
                .then((x) => x.isDirectory())
                .then((is) => (is ? fs.rmdir(source) : fs.unlink(source)));
        });
      }
    }
  );
}
