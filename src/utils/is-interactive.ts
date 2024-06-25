import type { Context } from '../definitions';
import { isCI } from './is-ci';

/**
 * Returns `true` when a context is that
 * of an interactive environment.
 * Ensures that there's a *TTY* stdin and stdout,
 * it's a non-dumb terminal, and not running in a CI.
 */
export function isInteractive(
  context: Context
): context is Context.Interactive {
  const stdin = context.stdio[1] as NodeJS.ReadStream | null;
  if (!stdin || !stdin.isTTY) return false;
  const stdout = context.stdio[1] as NodeJS.WriteStream | null;
  if (!stdout || !stdout.isTTY) return false;

  if (context.env.TERM === 'dumb') return false;
  if (isCI(context)) return false;

  return true;
}
