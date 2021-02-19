import { Task, Context } from '../../definitions';
import { flatten } from '../../helpers/flatten';
import { run } from '../../utils/run';
import { log } from '../stdio/log';
import { Empty, NullaryFn, Members } from 'type-core';
import { into } from 'pipettes';

export function parallel(
  task?: Task | Empty | Array<Task | Empty> | Members<Task | Empty>,
  ...tasks: Array<Task | Empty>
): Task.Async {
  const items = flatten(task, ...tasks);

  return async (ctx: Context): Promise<void> => {
    into(ctx, log('debug', 'Run tasks in parallel'));

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
          return run(task, {
            ...ctx,
            cancellation: new Promise((resolve) => {
              cbs.push(resolve);
            })
          });
        })
      );
    } catch (err) {
      cancel();
      throw err;
    }
  };
}