import type { UnaryFn } from 'type-core';

import type { Context, Task } from '../../definitions';

/**
 * Raises an error.
 * @returns Task
 */
export function raises(
  error: Error | string | UnaryFn<Context, Error | string>
): Task.Sync {
  return (ctx: Context): void => {
    const err = typeof error === 'function' ? error(ctx) : error;
    throw typeof err === 'string' ? new Error(err) : err;
  };
}
