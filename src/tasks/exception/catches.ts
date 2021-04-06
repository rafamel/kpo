import { Task, Context, LogLevel } from '../../definitions';
import { stringifyError } from '../../helpers/stringify';
import { isCancelled } from '../../utils/is-cancelled';
import { run } from '../../utils/run';
import { log } from '../stdio/log';
import { shallow } from 'merge-strategies';
import { into } from 'pipettes';

export interface CatchesOptions {
  /** Logs the error message with a given level. Default: `'warn'` */
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
      await run(task, ctx);
    } catch (err) {
      if (await isCancelled(ctx)) return;

      into(ctx, log('trace', err));
      into(ctx, log(opts.level, stringifyError(err)));
      if (alternate) await run(alternate, ctx);
    }
  };
}
