import { Task, Context } from '../definitions';
import { createContext } from '../helpers/create-context';
import { isCancelled } from './is-cancelled';
import { TypeGuard } from 'type-core';

const noop = (): void => undefined;

/**
 * Safely runs a task with an optional given context.
 */
export async function run(
  task: Task,
  context?: Partial<Context>
): Promise<void> {
  const unsafe = createContext(context);
  const ctx = { ...unsafe, cancellation: unsafe.cancellation.catch(noop) };

  if (await isCancelled(ctx)) return;
  if (!TypeGuard.isFunction(task)) {
    throw Error(`Task is not a function: ${task}`);
  }

  try {
    await task(ctx);
  } catch (err) {
    if (await isCancelled(ctx)) return;
    throw err;
  }
}
