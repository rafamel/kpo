import type { Context, Task } from '../../definitions';
import { series } from '../aggregate/series';
import { log } from '../stdio/log';

/**
 * Waits for a given number of milliseconds.
 * @returns Task
 */
export function sleep(ms: number): Task.Async {
  return series(
    log('debug', `Sleep for ${ms}ms`),
    async (ctx: Context): Promise<void> => {
      return new Promise((resolve) => {
        const timeout = setTimeout(() => resolve(), ms);
        ctx.cancellation.finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  );
}
