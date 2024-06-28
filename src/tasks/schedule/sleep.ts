import type { NullaryFn } from 'type-core';

import type { Context, Task } from '../../definitions';
import { onCancel } from '../../utils/cancellation';
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
      let timeout: null | NodeJS.Timeout = null;
      let cleanup: null | NullaryFn = null;
      return new Promise<void>((resolve) => {
        timeout = setTimeout(() => resolve(), ms);
        cleanup = onCancel(ctx, () => resolve());
      }).finally(() => {
        if (cleanup) cleanup();
        if (timeout) clearTimeout(timeout);
      });
    }
  );
}
