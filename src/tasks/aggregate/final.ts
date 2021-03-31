/* eslint-disable no-useless-catch */
import { Task, Context } from '../../definitions';

/**
 * Always executes a `final` task after another.
 * If the first throws an exception and the second
 * does not, it will finally throw the initial exception.
 * @returns Task
 */
export function final(task: Task, final?: Task | null): Task.Async {
  return async (ctx: Context): Promise<void> => {
    try {
      await task(ctx);
    } catch (err) {
      throw err;
    } finally {
      if (final) await final(ctx);
    }
  };
}
