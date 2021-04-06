import { into } from 'pipettes';
import { Task, Context } from '../../definitions';
import { isCancelled } from '../../utils/is-cancelled';
import { run } from '../../utils/run';
import { log } from '../stdio/log';

/**
 * Always executes a `final` task after another.
 * If the first throws an exception and the second
 * does not, it will finally throw the initial exception.
 * @returns Task
 */
export function finalize(task: Task, final?: Task | null): Task.Async {
  return async (ctx: Context): Promise<void> => {
    const errors: Error[] = [];

    try {
      await run(task, ctx);
    } catch (err) {
      errors.push(err);
    }

    if (await isCancelled(ctx)) return;

    try {
      if (final) await run(final, ctx);
    } catch (err) {
      errors.push(err);
    }

    if (!errors.length || (await isCancelled(ctx))) return;

    const err = errors.pop();
    while (errors.length > 0) {
      into(ctx, log('trace', errors.shift()));
    }
    throw err;
  };
}
