import { Empty, TypeGuard } from 'type-core';

import { Task, Context } from '../definitions';
import { createContext } from '../helpers/create-context';
import { isCancelled } from './is-cancelled';

const noop = (): void => undefined;

/**
 * Safely runs a task with an optional given context.
 */
export async function run(
  context: Partial<Context> | Empty,
  task: Task
): Promise<void> {
  const unsafe = createContext(context || undefined);
  const ctx = { ...unsafe, cancellation: unsafe.cancellation.catch(noop) };

  if (await isCancelled(ctx)) return;
  if (!TypeGuard.isFunction(task)) {
    throw new TypeError(`Task is not a function: ${task}`);
  }

  try {
    await task(ctx);
  } catch (err) {
    if (await isCancelled(ctx)) return;
    throw err;
  }
}
