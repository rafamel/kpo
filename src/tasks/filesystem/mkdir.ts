import { shallow } from 'merge-strategies';
import fs from 'fs-extra';

import type { Context, Task } from '../../definitions';
import { getPaths } from '../../helpers/paths';
import { isCancelled } from '../../utils/cancellation';
import { series } from '../aggregate/series';
import { log } from '../stdio/log';

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
  return series(
    log('debug', 'Create directories:', paths),
    async (ctx: Context): Promise<void> => {
      const opts = shallow({ ensure: false }, options || undefined);

      const dirs = await getPaths(paths, ctx, { glob: false, strict: false });

      for (const dir of dirs) {
        if (isCancelled(ctx)) return;
        await (opts.ensure ? fs.ensureDir(dir) : fs.mkdir(dir));
      }
    }
  );
}
