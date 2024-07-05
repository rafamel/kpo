import type { Empty, MaybePromise, UnaryFn } from 'type-core';

import type { Context, Task } from '../../definitions';
import { run } from '../../utils/run';

/**
 * Takes an optionally *Task* returning function and
 * turns the function itself and the returned *Task*
 * into a single sequential *Task*.
 * @returns Task
 */
export function create(
  callback: UnaryFn<Context, MaybePromise<Task | Empty>>
): Task.Async {
  return async (ctx: Context): Promise<void> => {
    const task = await callback(ctx);
    if (task) await run(ctx, task);
  };
}
