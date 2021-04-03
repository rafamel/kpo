import { Task, Context } from '../../definitions';
import { getPaths } from '../../helpers/paths';
import { isCancelled } from '../../utils/is-cancelled';
import { log } from '../stdio/log';
import { shallow } from 'merge-strategies';
import { into } from 'pipettes';
import fs from 'fs-extra';

export interface MkdirOptions {
  /** Create if necessary, including intermediate directories */
  ensure?: boolean;
}

/**
 * Creates a directory.
 * @returns Task
 */
export function mkdir(
  paths: string | string[],
  options?: MkdirOptions
): Task.Async {
  return async (ctx: Context): Promise<void> => {
    into(ctx, log('debug', 'Create directories:', paths));

    const opts = shallow({ ensure: false }, options || undefined);

    const dirs = await getPaths(paths, ctx, { glob: false, strict: false });

    for (const dir of dirs) {
      if (await isCancelled(ctx)) return;
      opts.ensure ? fs.ensureDir(dir) : fs.mkdir(dir);
    }
  };
}
