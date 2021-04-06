import { Task, LogLevel, Context } from '../../definitions';
import { styleString } from '../../helpers/style-string';
import { addPrefix } from '../../helpers/prefix';
import { Members } from 'type-core';
import util from 'util';

const rank: Members<number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5
};

const color = {
  trace: (str: string) =>
    styleString(str, { bold: true, bg: 'magenta', color: 'white' }),
  debug: (str: string) =>
    styleString(str, { bold: true, bg: 'cyan', color: 'white' }),
  info: (str: string) =>
    styleString(str, { bold: true, bg: 'green', color: 'white' }),
  warn: (str: string) =>
    styleString(str, { bold: true, bg: 'yellow', color: 'white' }),
  error: (str: string) =>
    styleString(str, { bold: true, bg: 'red', color: 'white' })
};

/**
 * Writes a message or other data into a
 * context's stdout if a given `context.level`
 * allows for the particular logging level
 * of the call.
 * @returns Task
 */
export function log(level: LogLevel, item: any, ...data: any[]): Task.Sync {
  level = String(level).toLowerCase() as LogLevel;
  const nLevel = rank[level.toLowerCase()] || 5;

  return (ctx: Context): void => {
    if (level === 'silent' || level.toLowerCase() === 'silent') return;

    const nCurrent = rank[String(ctx.level).toLowerCase()] || 0;
    if (nCurrent >= nLevel) {
      const str = addPrefix(
        util.format(item, ...data) + '\n',
        getLoggerMessagePrefix(level),
        'print',
        ctx
      );
      nLevel > rank.warn ? ctx.stdio[1].write(str) : ctx.stdio[2].write(str);
    }
  };
}

function getLoggerMessagePrefix(level: Exclude<LogLevel, 'silent'>): string {
  const fn = color[level];
  const name = level.toUpperCase();
  return fn ? fn(` ${name} `) : styleString(name, { bold: true });
}
