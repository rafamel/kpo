import util from 'util';
import { Task, LogLevel, Context } from '../../definitions';
import { addPrefix } from '../../helpers/prefix';
import {
  getLogLevelPrefix,
  isLogLevelActive,
  normalizeLogLevel
} from '../../helpers/logging';

/**
 * Writes a message or other data into a
 * context's stdout if a given `context.level`
 * allows for the particular logging level
 * of the call.
 * @returns Task
 */
export function log(level: LogLevel, item: any, ...data: any[]): Task.Sync {
  return (ctx: Context): void => {
    if (isLogLevelActive(level, ctx)) {
      const str = addPrefix(
        util.format(item, ...data) + '\n',
        getLogLevelPrefix(level),
        'print',
        ctx
      );

      normalizeLogLevel(level) === 'error'
        ? ctx.stdio[2] && ctx.stdio[2].write(str)
        : ctx.stdio[1] && ctx.stdio[1].write(str);
    }
  };
}
