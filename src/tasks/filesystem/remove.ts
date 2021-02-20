import { Task, Context } from '../../definitions';
import { getPaths, useSource } from '../../helpers/paths';
import { isCancelled } from '../../utils/is-cancelled';
import { log } from '../stdio/log';
import { into } from 'pipettes';
import fs from 'fs-extra';

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
  return async (ctx: Context): Promise<void> => {
    into(ctx, log('debug', 'Remove:', paths));

    const opts = Object.assign(
      { glob: false, strict: false, exists: 'error' },
      options
    );
    const sources = await getPaths(paths, ctx, {
      glob: opts.glob,
      strict: opts.strict
    });

    for (const source of sources) {
      if (await isCancelled(ctx)) return;

      await useSource(source, ctx, { strict: opts.strict }, (source) => {
        return opts.recursive
          ? fs.remove(source)
          : fs
              .stat(source)
              .then((x) => x.isDirectory())
              .then((is) => (is ? fs.rmdir(source) : fs.unlink(source)));
      });
    }
  };
}
