import { Task, Context } from '../../definitions';
import { getPathPairs, usePair } from '../../helpers/paths';
import { isCancelled } from '../../utils';
import { log } from './log';
import { into } from 'pipettes';
import fs from 'fs-extra';

export interface CopyOptions {
  glob?: boolean;
  single?: boolean;
  strict?: boolean;
  exists?: 'error' | 'ignore' | 'overwrite';
}

export function copy(
  paths: string | string[],
  destination: string,
  options?: CopyOptions
): Task.Async {
  return async (ctx: Context): Promise<void> => {
    into(ctx, log('debug', 'Copy', paths, 'to', destination));

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
          return fs.copy(src, dest, {
            overwrite: true,
            errorOnExist: true,
            dereference: false,
            preserveTimestamps: false
          });
        }
      );
    }
  };
}
