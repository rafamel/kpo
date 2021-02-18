import { Task, LogLevel, Context } from '../../definitions';
import { addPrefix } from '../../helpers/prefix';
import { Members } from 'type-core';
import chalk from 'chalk';
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
  trace: chalk.bold.bgMagenta.white,
  debug: chalk.bold.bgCyan.white,
  info: chalk.bold.bgGreen.white,
  warn: chalk.bold.bgYellow.white,
  error: chalk.bold.bgRed.white
};

export function log(
  level: Exclude<LogLevel, 'silent'>,
  item: any,
  ...data: any[]
): Task.Sync {
  const nLevel = rank[String(level).toLowerCase()] || 5;

  return (ctx: Context): void => {
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
  return fn ? fn(` ${name} `) : chalk.bold(name);
}
