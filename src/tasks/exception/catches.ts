import { Empty } from 'type-core';
import { shallow } from 'merge-strategies';
import { into } from 'pipettes';
import { Task, Context, LogLevel } from '../../definitions';
import { stringifyError } from '../../helpers/stringify';
import { run } from '../../utils/run';
import { series } from '../aggregate/series';
import { log } from '../stdio/log';

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
  options: CatchesOptions | Empty,
  task: Task,
  alternate?: Task | null
): Task.Async {
  return async (ctx: Context): Promise<void> => {
    const opts = shallow({ level: 'warn' }, options || undefined);

    try {
      await run(ctx, task);
    } catch (err) {
      await into(
        series(
          log('trace', err),
          log(opts.level, stringifyError(err)),
          alternate
        ),
        (task) => run(ctx, task)
      );
    }
  };
}
