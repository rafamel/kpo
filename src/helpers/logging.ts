import isUnicodeSupported from 'is-unicode-supported';

import { Context, LogLevel } from '../definitions';
import { style } from '../utils/style';
import { getBadge, getBadgeColor } from './badges';

const ranks: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  success: 3,
  info: 4,
  debug: 5,
  trace: 6
};

const unicode = isUnicodeSupported();

export function normalizeLogLevel<T extends string>(level?: T): T {
  return String(level).toLowerCase() as T;
}

export function getLogLevels(): LogLevel[] {
  return Object.keys(ranks) as LogLevel[];
}

export function getLogLevelPrefix(level: LogLevel): string {
  const normal = normalizeLogLevel(level);
  if (!isLogLevel(normal) || normal === 'silent') {
    return style(` ${normal.toUpperCase()} `, { bold: true });
  }
  if (!unicode) {
    return style(` ${normal.toUpperCase()} `, {
      bold: true,
      color: 'whiteBright',
      bg: getBadgeColor(normal)
    });
  }
  return getBadge(normal);
}

export function isLogLevel(level: string): level is LogLevel {
  return Object.hasOwnProperty.call(ranks, normalizeLogLevel(level));
}

export function isLogLevelActive(level: LogLevel, context: Context): boolean {
  const levelArg = normalizeLogLevel(level);
  const levelArgRank = isLogLevel(levelArg)
    ? ranks[levelArg]
    : Math.min(...Object.values(ranks));
  if (levelArgRank <= 0) return false;

  const levelCtx = normalizeLogLevel(context.level);
  const levelCtxRank = isLogLevel(levelCtx)
    ? ranks[levelCtx]
    : Math.max(...Object.values(ranks));

  return levelCtxRank >= levelArgRank;
}
