import { Context, LogLevel } from '../definitions';
import { isLogLevelActive } from '../helpers/logging';

export function isLevelActive(level: LogLevel, context: Context): boolean {
  return isLogLevelActive(level, context);
}
