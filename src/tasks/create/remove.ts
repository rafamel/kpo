import { Task, Context } from '../../definitions';
import { getPaths, useSource } from '../../helpers/paths';
import { isCancelled } from '../../utils';
import { log } from './log';
import { into } from 'pipettes';
import fs from 'fs-extra';

export interface RemoveOptions {
  glob?: boolean;
  strict?: boolean;
  recursive?: boolean;
}

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
