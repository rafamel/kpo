import { Task, Context } from '../../definitions';
import { parseToRecord } from '../../helpers/parse';
import { run } from '../../utils/run';
import { recreate } from '../../utils/recreate';
import { context } from '../transform/context';
import { series } from './series';
import { into } from 'pipettes';

/**
 * Takes a task nested record `tasks` and runs a number
 * of them in series as selected by their `names`.
 * A task name will be the stringification of its route
 * in the record, with a ':' character for each level deep.
 * Targetting a level with inner tasks will run all of them.
 * @returns Task
 */
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
      parseToRecord.bind(null, {
        include: keys,
        exclude: null,
        defaults: true
      }),
      (record) => keys.map((key) => record[key]),
      (arr) => series(...arr),
      (task) => run(task, ctx)
    );
  };
}
