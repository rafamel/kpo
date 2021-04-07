import { Task, LogLevel, Context } from '../../definitions';
import { addPrefix } from '../../helpers/prefix';
import { style, StyleColor } from '../../utils/style';
import isUnicodeSupported from 'is-unicode-supported';
import util from 'util';

const unicode = isUnicodeSupported();
// Symbols: 🅧, 🆇, ⓧ, ✖, ‼, ⚠, ✔︎, ✓, ⓘ, ⅈ, ℹ︎, 🅳, 🅓, ⓓ, », 🆃, 🅣, ⓣ, ⊗, ⊘
const levels: Record<LogLevel, [number, string, StyleColor | undefined]> = {
  silent: [0, '', undefined],
  error: [1, '🆇 ', 'red'],
  warn: [2, '‼ ', 'yellow'],
  success: [3, '✔︎✔︎', 'green'],
  info: [4, 'ⅈ ', 'blue'],
  debug: [5, '🅳 ', 'magenta'],
  trace: [6, '🆃 ', 'grey']
};

/**
 * Writes a message or other data into a
 * context's stdout if a given `context.level`
 * allows for the particular logging level
 * of the call.
 * @returns Task
 */
export function log(level: LogLevel, item: any, ...data: any[]): Task.Sync {
  const levelArg = normalizeLevel(level);
  const levelArgRank = levels[levelArg]
    ? levels[levelArg][0]
    : Math.min(...Object.values(levels).map((arr) => arr[0]));

  return (ctx: Context): void => {
    if (levelArg === 'silent') return;

    const levelCtx = normalizeLevel(ctx.level);
    const levelCtxRank = levels[levelCtx]
      ? levels[levelCtx][0]
      : Math.max(...Object.values(levels).map((arr) => arr[0]));

    if (levelCtxRank >= levelArgRank) {
      const str = addPrefix(
        util.format(item, ...data) + '\n',
        getLoggerMessagePrefix(levelArg),
        'print',
        ctx
      );

      levelArgRank === levels.error[0]
        ? ctx.stdio[2].write(str)
        : ctx.stdio[1].write(str);
    }
  };
}

function normalizeLevel(level: LogLevel): LogLevel {
  return String(level).toLowerCase() as LogLevel;
}

function getLoggerMessagePrefix(level: LogLevel): string {
  const params = levels[level];
  if (!params) return style(level.toUpperCase(), { bold: true });
  if (unicode) return style(params[1], { bold: true, color: params[2] });
  return style(` ${level.toUpperCase()} `, {
    bold: true,
    bg: params[2],
    color: 'white'
  });
}
