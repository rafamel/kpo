import type { NullaryFn } from 'type-core';
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
export function onCancel(context: Context, cb: NullaryFn): NullaryFn {
  if (isCancelled(context)) {
    setTimeout(() => cb(), 0);
    return () => {};
  }

  const listener = () => cb();
  context.cancellation.addEventListener('abort', listener, { once: true });
  return () => context.cancellation.removeEventListener('abort', listener);
}
