import type { Dictionary } from '../../types';
import type { Context, Task } from '../../definitions';
import { flatten } from '../../helpers/flatten';
import { isCancelled } from '../../utils/cancellation';
import { run } from '../../utils/run';

/**
 * Returns a `Task` that will run in series
 * a set of given tasks.
 * For tasks passed as arguments, the route
 * will be left unmodified, while task
 * lists and records will inherit their
 * index or key name for their route.
 * @returns Task
 */
export function series(
  task?: null | Task | Array<null | Task> | Dictionary<null | Task>,
  ...tasks: Array<null | Task>
): Task.Async {
  const items = flatten(task, ...tasks);

  return async (ctx: Context): Promise<void> => {
    for (const task of items) {
      if (isCancelled(ctx)) break;
      await run(ctx, task);
    }
  };
}
