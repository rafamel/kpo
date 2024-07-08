import { TypeGuard } from 'type-core';
import { shallow } from 'merge-strategies';

import type { Callable, Promisable } from '../../types';
import type { Context, Task } from '../../definitions';
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
    | null
    | Partial<Context>
    | Callable<Context, Promisable<null | Partial<Context>>>,
  task: Task
): Task.Async {
  const fn = TypeGuard.isFunction(context) ? context : () => context;
  return async (context: Context): Promise<void> => {
    const ctx = await fn(context);
    await run(shallow(context, ctx || undefined), task);
  };
}
