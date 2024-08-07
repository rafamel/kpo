import type { Dictionary } from '../../types';
import type { Context, Task } from '../../definitions';
import { flatten } from '../../helpers/flatten';
import { onCancel } from '../../utils/cancellation';
import { run } from '../../utils/run';

/**
 * Returns a `Task` that will run in parallel
 * a set of given tasks.
 * Suppresses the context's stdin.
 * For tasks passed as arguments, the route
 * will be left unmodified, while task
 * lists and records will inherit their
 * index or key name for their route.
 * @returns Task
 */

export function parallel(
  task?: null | Task | Array<null | Task> | Dictionary<null | Task>,
  ...tasks: Array<null | Task>
): Task.Async {
  const items = flatten(task, ...tasks);

  return async (ctx: Context): Promise<void> => {
    const controllers: AbortController[] = [];
    function cancel(): void {
      while (controllers.length) {
        const controller = controllers.shift();
        if (controller) controller.abort();
      }
    }

    const cleanup = onCancel(ctx, () => cancel());
    try {
      await Promise.all(
        items.map((task) => {
          const controller = new AbortController();
          controllers.push(controller);
          return run(
            {
              ...ctx,
              stdio: [null, ctx.stdio[1], ctx.stdio[2]],
              cancellation: controller.signal
            },
            task
          );
        })
      );
    } catch (err) {
      cancel();
      throw err;
    } finally {
      cleanup();
    }
  };
}
