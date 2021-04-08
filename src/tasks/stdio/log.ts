import isUnicodeSupported from 'is-unicode-supported';
import util from 'util';
import { Task, LogLevel, Context } from '../../definitions';
import { addPrefix } from '../../helpers/prefix';
import { style } from '../../utils/style';
import {
  getLogLevelColor,
  getLogLevelSymbol,
  isLogLevel,
  isLogLevelActive,
  normalizeLogLevel
} from '../../helpers/logging';

const unicode = isUnicodeSupported();

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
        getLoggerMessagePrefix(normalizeLogLevel(level)),
        'print',
        ctx
      );

      normalizeLogLevel(level) === 'error'
        ? ctx.stdio[2].write(str)
        : ctx.stdio[1].write(str);
    }
  };
}

function getLoggerMessagePrefix(level: LogLevel): string {
  if (!isLogLevel(level)) {
    return style((level as string).toUpperCase(), {
      bold: true
    });
  }
  if (unicode) {
    return style(getLogLevelSymbol(level), {
      bold: true,
      color: getLogLevelColor(level)
    });
  }
  return style(` ${level.toUpperCase()} `, {
    bold: true,
    bg: getLogLevelColor(level),
    color: 'white'
  });
}
