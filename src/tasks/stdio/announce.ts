import { Context, LogLevel, Task } from '../../definitions';
import { stringifyPrintRoute } from '../../helpers/stringify';
import { style } from '../../utils/style';
import { run } from '../../utils/run';
import { series } from '../aggregate/series';
import { log } from '../stdio/log';
import { shallow } from 'merge-strategies';
import { into } from 'pipettes';

export interface AnnounceOptions {
  level?: LogLevel;
}

/**
 * Prints tasks route before execution.
 * @returns Task
 */
export function announce(task: Task, options?: AnnounceOptions): Task.Async {
  return async (ctx: Context): Promise<void> => {
    const opts = shallow({ level: 'info' }, options || undefined);

    return into(
      ctx.route.length
        ? log(
            opts.level,
            style('task |', { bold: true }),
            stringifyPrintRoute(ctx.route)
          )
        : null,
      (first) => series(first, task),
      (task) => run(task, ctx)
    );
  };
}
