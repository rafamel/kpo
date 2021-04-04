import { Task, Context } from '../../definitions';
import { parseToRecord } from '../../helpers/parse';
import { run } from '../../utils/run';
import { recreate } from '../../utils/recreate';
import { context } from '../transform/context';
import { series } from './series';
import { NullaryFn } from 'type-core';
import { shallow } from 'merge-strategies';
import { into } from 'pipettes';

export interface CombineOptions {
  /**
   * An array of strings indicating the name of the tasks
   * to include for a task record.
   * A task name is the stringification of its route in the record,
   * joined by with a ':' character for each depth level.
   * Targetting a level with inner tasks will run all of them.
   */
  include?: string[] | null;
  /**
   * An array of strings indicating the name of the tasks
   * to exclude for a task record.
   * A task name is the stringification of its route in the record,
   * joined by with a ':' character for each depth level.
   */
  exclude?: string[] | null;
}

/**
 * Takes a task nested record `tasks` and runs a number
 * of them in series as selected by the inclusion or exclusion options.
 * @returns Task
 */
export function combine(
  tasks: Task.Record | NullaryFn<Task.Record>,
  options?: CombineOptions
): Task.Async {
  return async (ctx: Context): Promise<void> => {
    const opts: Required<CombineOptions> = shallow(
      { include: null, exclude: null },
      options || undefined
    );

    return into(
      recreate(tasks, (task, route) => {
        return context(
          (ctx) => ({ ...ctx, route: ctx.route.concat(route) }),
          task
        );
      }),
      parseToRecord.bind(null, {
        include: opts.include,
        exclude: opts.exclude,
        defaults: true,
        roots: Array.isArray(opts.include)
      }),
      (record) => {
        return Array.isArray(opts.include)
          ? opts.include.map((name) => record[name])
          : Object.values(record);
      },
      (arr) => series(...arr),
      (task) => run(task, ctx)
    );
  };
}
