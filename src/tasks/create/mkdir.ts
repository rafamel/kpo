import { Task, Context } from '../../definitions';
import { getPaths } from '../../helpers/paths';
import { isCancelled } from '../../utils';
import { log } from './log';
import { into } from 'pipettes';
import fs from 'fs-extra';

export interface MkdirOptions {
  ensure?: boolean;
}

export function mkdir(
  paths: string | string[],
  options?: MkdirOptions
): Task.Async {
  return async (ctx: Context): Promise<void> => {
    into(ctx, log('debug', 'Create directories:', paths));

    const opts = Object.assign({ ensure: false }, options);

    const dirs = await getPaths(paths, ctx, { glob: false, strict: false });

    for (const dir of dirs) {
      if (await isCancelled(ctx)) return;
      opts.ensure ? fs.ensureDir(dir) : fs.mkdir(dir);
    }
  };
}
