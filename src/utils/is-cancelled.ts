import type { Context } from '../definitions';

/**
 * A promise returning function that will
 * resolve with `true` if `context.cancellation`
 * has finalized, and `false` otherwise.
 */
export async function isCancelled(context: Context): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    context.cancellation.finally(() => resolve(true));
    setTimeout(() => resolve(false), 0);
  });
}
