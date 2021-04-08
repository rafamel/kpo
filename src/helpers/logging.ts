import { StyleColor } from '~/utils';
import { Context, LogLevel } from '../definitions';

const ranks: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  success: 3,
  info: 4,
  debug: 5,
  trace: 6
};

// Symbols: 🅧, 🆇, ⓧ, ✖, ‼, ⚠, ✔︎, ✓, ⓘ, ⅈ, ℹ︎, 🅳, 🅓, ⓓ, », 🆃, 🅣, ⓣ, ⊗, ⊘
const styles: Record<LogLevel, [string, StyleColor | null]> = {
  silent: ['', null],
  error: ['🆇 ', 'red'],
  warn: ['‼ ', 'yellow'],
  success: ['✔︎✔︎', 'green'],
  info: ['ⅈ ', 'blue'],
  debug: ['🅳 ', 'magenta'],
  trace: ['🆃 ', 'grey']
};

export function isLogLevel(level: string): level is LogLevel {
  return Object.keys(ranks).includes(level);
}

export function isLogLevelActive(level: LogLevel, context: Context): boolean {
  const levelArg = normalizeLogLevel(level);
  const levelArgRank = ranks[levelArg] || Math.min(...Object.values(ranks));
  if (levelArgRank <= 0) return false;

  const levelCtx = normalizeLogLevel(context.level);
  const levelCtxRank = ranks[levelCtx] || Math.max(...Object.values(ranks));
  return levelCtxRank >= levelArgRank;
}

export function normalizeLogLevel<T extends string>(level?: T): T {
  return String(level).toLowerCase() as T;
}

export function getLogLevels(): LogLevel[] {
  return Object.keys(ranks) as LogLevel[];
}

export function getLogLevelSymbol(level: LogLevel): string {
  return styles[level][0];
}

export function getLogLevelColor(level: LogLevel): StyleColor | undefined {
  return styles[level][1] || undefined;
}
