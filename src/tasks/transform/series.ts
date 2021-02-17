import { Task, Context } from '../../definitions';
import { isCancelled } from '../../utils';
import { run } from '../consume/run';
import { log } from '../create/log';
import { Empty } from 'type-core';
import { into } from 'pipettes';

export function series(...tasks: Array<Task | Empty>): Task.Async {
  return async (ctx: Context): Promise<void> => {
    into(ctx, log('debug', 'Run tasks in series'));

    for (let i = 0; i < tasks.length; i++) {
      if (await isCancelled(ctx)) break;

      const task = tasks[i];

      if (task) {
        await run(task, { ...ctx, route: ctx.route.concat(i) });
      }
    }
  };
}
