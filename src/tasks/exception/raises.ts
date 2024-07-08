import { TypeGuard } from 'type-core';

import type { Callable } from '../../types';
import type { Context, Task } from '../../definitions';

/**
 * Raises an error.
 * @returns Task
 */
export function raises(
  error?: null | string | Error | Callable<Context, null | string | Error>
): Task.Sync {
  return (ctx: Context): void => {
    const err = TypeGuard.isFunction(error) ? error(ctx) : error;
    throw TypeGuard.isString(err) || !err ? new Error(err || '') : err;
  };
}
