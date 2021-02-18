import { Task, Context } from '../../definitions';
import { run } from '../../utils/run';
import { UnaryFn, Empty } from 'type-core';

export function context(
  context:
    | Empty
    | Partial<Context>
    | UnaryFn<Context, Partial<Context> | Empty>,
  task: Task
): Task.Async {
  const fn = typeof context === 'function' ? context : () => context;
  return async (context: Context): Promise<void> => {
    await run(task, { ...context, ...fn(context) });
  };
}
