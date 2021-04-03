import { Task, Context, LogLevel } from '../../definitions';
import { formatMessage } from '../../helpers/format-message';
import { log } from '../stdio/log';
import { shallow } from 'merge-strategies';
import { into } from 'pipettes';

export interface CatchesOptions {
  /** Logs the error message with a given level. Default: `'info'` */
  level?: LogLevel;
}

/**
 * Catches errors in a `task`, preventing it
 * from stopping execution of other tasks
 * when run in series or parallel.
 * When a `task` raises an exception,
 * it will log the error message with
 * a given `options.level`, and optionally
 * run an `alternate` task.
 * @returns Task
 */
export function catches(
  task: Task,
  alternate?: Task | null,
  options?: CatchesOptions
): Task.Async {
  return async (ctx: Context): Promise<void> => {
    const opts = shallow({ level: 'warn' }, options || undefined);
    try {
      await task(ctx);
    } catch (err) {
      if (opts.level !== 'silent') {
        into(ctx, log(opts.level, formatMessage(err)));
      }
      if (alternate) {
        await alternate(ctx);
      }
    }
  };
}
