import { Task, Context } from '../../definitions';
import { flatten } from '../../helpers/flatten';
import { isCancelled } from '../../utils/is-cancelled';
import { run } from '../../utils/run';
import { log } from '../stdio/log';
import { Empty, Members } from 'type-core';
import { into } from 'pipettes';

export function series(
  task?: Task | Empty | Array<Task | Empty> | Members<Task | Empty>,
  ...tasks: Array<Task | Empty>
): Task.Async {
  const items = flatten(task, ...tasks);

  return async (ctx: Context): Promise<void> => {
    into(ctx, log('debug', 'Run tasks in series'));

    for (const task of items) {
      if (await isCancelled(ctx)) break;
      await run(task, ctx);
    }
  };
}
