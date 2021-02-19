import { Task, Context, LogLevel } from '../../definitions';
import { formatMessage } from '../../helpers/format-message';
import { log } from '../stdio/log';
import { into } from 'pipettes';

export interface CatchesOptions {
  level?: LogLevel;
}

export function catches(
  task: Task,
  alternate?: Task | null,
  options?: CatchesOptions
): Task.Async {
  return async (ctx: Context): Promise<void> => {
    const opts = Object.assign({ level: 'warn' }, options);
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
