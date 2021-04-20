import { Task, Context } from '../../definitions';
import { flatten } from '../../helpers/flatten';
import { run } from '../../utils/run';
import { Empty, NullaryFn, Members } from 'type-core';

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
  task?: Task | Empty | Array<Task | Empty> | Members<Task | Empty>,
  ...tasks: Array<Task | Empty>
): Task.Async {
  const items = flatten(task, ...tasks);

  return async (ctx: Context): Promise<void> => {
    const cbs: NullaryFn[] = [];
    function cancel(): void {
      while (cbs.length) {
        const cb = cbs.shift();
        if (cb) cb();
      }
    }

    ctx.cancellation.finally(() => cancel());

    try {
      await Promise.all(
        items.map((task) => {
          return run(
            {
              ...ctx,
              stdio: [null, ctx.stdio[1], ctx.stdio[2]],
              cancellation: new Promise((resolve) => {
                cbs.push(resolve);
              })
            },
            task
          );
        })
      );
    } catch (err) {
      cancel();
      throw err;
    }
  };
}
