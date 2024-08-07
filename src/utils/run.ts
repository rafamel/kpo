import { TypeGuard } from 'type-core';

import type { Context, Task } from '../definitions';
import { createContext } from '../helpers/create-context';
import { isCancelled } from './cancellation';

/**
 * Safely runs a task with an optional given context.
 */
export async function run(
  context: Partial<Context> | null,
  task: Task
): Promise<void> {
  const ctx = createContext(context || undefined);

  if (isCancelled(ctx)) return;
  if (!TypeGuard.isFunction(task)) {
    throw new TypeError(`Task is not a function: ${task}`);
  }

  try {
    await task(ctx);
  } catch (err) {
    if (isCancelled(ctx)) return;
    throw err;
  }
}
