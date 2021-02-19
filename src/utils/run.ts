import { Task, Context } from '../definitions';
import { createContext } from '../helpers/create-context';
import { isCancelled } from './is-cancelled';
import { TypeGuard } from 'type-core';

const noop = (): void => undefined;

export async function run(
  task: Task,
  context?: Partial<Context>
): Promise<void> {
  const ctx = createContext(context);
  const safe = { ...ctx, cancellation: ctx.cancellation.catch(noop) };

  if (await isCancelled(safe)) return await ctx.cancellation;

  if (TypeGuard.isFunction(task)) await task(safe);
  else throw Error(`Task is not a function: ${task}`);

  if (await isCancelled(safe)) return await ctx.cancellation;
}
