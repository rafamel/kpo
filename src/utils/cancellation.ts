import type { Callable } from '../types';
import type { Context } from '../definitions';

/**
 * Will return `true` if `context.cancellation`
 * has emitted, and `false` otherwise.
 */
export function isCancelled(context: Context): boolean {
  return context.cancellation.aborted;
}

/**
 * Takes a `callback` to execute on cancellation.
 * If the cancellation had already happened,
 * `callback` will also be asynchronously executed.
 * Returns a cleanup function to stop waiting on cancellation.
 */
export function onCancel(context: Context, callback: Callable): Callable {
  if (isCancelled(context)) {
    setTimeout(() => callback(), 0);
    return () => {};
  }

  const listener = () => callback();
  context.cancellation.addEventListener('abort', listener, { once: true });
  return () => context.cancellation.removeEventListener('abort', listener);
}
