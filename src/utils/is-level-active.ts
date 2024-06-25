import type { Context, LogLevel } from '../definitions';
import { isLogLevelActive } from '../helpers/logging';

/**
 * Returns `true` when a logging level is
 * enabled for a context.
 */
export function isLevelActive(level: LogLevel, context: Context): boolean {
  return isLogLevelActive(level, context);
}
