import { Task, Context } from '../../definitions';
import { run } from '../../utils/run';
import { Empty, UnaryFn } from 'type-core';

/**
 * Takes an optionally *Task* returning function
 * and turns the function itself and the returned
 * *Task* into a single sequential *Task*.
 * @returns Task
 */
export function create(
  fn: UnaryFn<Context, Task | Empty | Promise<Task | Empty>>
): Task.Async {
  return async (ctx: Context): Promise<void> => {
    const task = await fn(ctx);
    if (task) await run(task, ctx);
  };
}
