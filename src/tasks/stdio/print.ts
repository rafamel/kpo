import util from 'node:util';

import type { Context, Task } from '../../definitions';
import { addPrefix } from '../../helpers/prefix';

/**
 * Writes a message or other data into a context's stdout.
 * @returns Task
 */
export function print(...data: any[]): Task.Sync {
  return (ctx: Context): void => {
    if (!ctx.stdio[1]) return;

    const str = addPrefix(
      data.length ? util.format(data[0], ...data.slice(1)) + '\n' : '\n',
      null,
      'print',
      ctx
    );
    ctx.stdio[1].write(str);
  };
}
