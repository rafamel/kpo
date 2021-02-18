import { Task, Context } from '../../definitions';
import { run } from '../../utils/run';
import { log } from '../stdio/log';
import { Empty, NullaryFn } from 'type-core';
import { into } from 'pipettes';

export function parallel(...tasks: Array<Task | Empty>): Task.Async {
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
        tasks.map((task, i) => {
          return task
            ? run(task, {
                ...ctx,
                route: ctx.route.concat(i),
                cancellation: new Promise((resolve) => {
                  cbs.push(resolve);
                })
              })
            : Promise.resolve();
        })
      );
    } catch (err) {
      cancel();
      throw err;
    }
  };
}
