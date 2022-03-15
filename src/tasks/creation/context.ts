import { UnaryFn, Empty } from 'type-core';
import { shallow } from 'merge-strategies';

import { Task, Context } from '../../definitions';
import { run } from '../../utils/run';

/**
 * Modifies a task's context with a given `context`.
 * Takes a `context` as a first argument, which
 * can be a partial `Context` object, or
 * a callback receiving a `Context` and
 * returning a partial `Context` object.
 * @returns Task
 */
export function context(
  context:
    | Empty
    | Partial<Context>
    | UnaryFn<Context, Partial<Context> | Empty>,
  task: Task
): Task.Async {
  const fn = typeof context === 'function' ? context : () => context;
  return async (context: Context): Promise<void> => {
    await run(shallow(context, fn(context) || undefined), task);
  };
}
