import { Context } from '../definitions';
import { isCI } from './is-ci';

/**
 * Returns `true` when a context belongs to an interactive
 * environment.
 * Ensures that the context interactive property is `true`,
 * the stdout is a non-dumb *TTY*, and it's not running in a CI.
 */
export function isInteractive(context: Context): boolean {
  if (!context.interactive) return false;

  const stdout = context.stdio[1] as NodeJS.WriteStream;
  if (!stdout || !stdout.isTTY) return false;

  if (context.env.TERM === 'dumb') return false;
  if (isCI(context)) return false;

  return true;
}
