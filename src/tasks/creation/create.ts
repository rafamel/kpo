import type { Callable, Promisable } from '../../types';
import type { Context, Task } from '../../definitions';
import { run } from '../../utils/run';

/**
 * Takes an optionally *Task* returning function and
 * turns the function itself and the returned *Task*
 * into a single sequential *Task*.
 * @returns Task
 */
export function create(
  callback?: null | Callable<Context, Promisable<void | null | Task>>
): Task.Async {
  return async (ctx: Context): Promise<void> => {
    if (!callback) return;

    const task = await callback(ctx);
    if (task) await run(ctx, task);
  };
}
