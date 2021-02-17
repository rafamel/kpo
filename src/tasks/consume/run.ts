import { Task, Context } from '../../definitions';
import { createContext } from '../../helpers/create-context';
import { isCancelled } from '../../utils';
import { log } from '../create/log';
import { into } from 'pipettes';

const noop = (): void => undefined;

export async function run(
  task: Task,
  context?: Partial<Context>
): Promise<void> {
  const ctx = createContext(context);
  const safe = { ...ctx, cancellation: ctx.cancellation.catch(noop) };

  try {
    if (await isCancelled(safe)) return await ctx.cancellation;
    await task(safe);
    if (await isCancelled(safe)) return await ctx.cancellation;
  } catch (err) {
    into(safe, log('error', err));
    throw err;
  }
}
