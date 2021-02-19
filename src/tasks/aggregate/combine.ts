import { Task, Context } from '../../definitions';
import { parseToRecord } from '../../helpers/parse';
import { run } from '../../utils/run';
import { recreate } from '../../utils/recreate';
import { context } from '../transform/context';
import { series } from './series';
import { into } from 'pipettes';

export function combine(
  tasks: Task.Record,
  names: string | string[]
): Task.Async {
  const keys = Array.isArray(names) ? names : [names];

  return async (ctx: Context): Promise<void> => {
    return into(
      tasks,
      recreate.bind(null, (task, route) => {
        return context(
          (ctx) => ({
            ...ctx,
            route: ctx.route.concat(route)
          }),
          task
        );
      }),
      parseToRecord.bind(null, { include: keys, exclude: null }),
      (record) => keys.map((key) => record[key]),
      (arr) => series(...arr),
      (task) => run(task, ctx)
    );
  };
}
