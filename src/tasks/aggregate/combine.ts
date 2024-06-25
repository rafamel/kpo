import type { Empty, NullaryFn } from 'type-core';
import { shallow } from 'merge-strategies';
import { into } from 'pipettes';

import type { Task } from '../../definitions';
import { parseToRecord } from '../../helpers/parse';
import { recreate } from '../../utils/recreate';
import { context } from '../creation/context';
import { create } from '../creation/create';
import { series } from './series';

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
  options: CombineOptions | Empty,
  tasks: Task.Record | NullaryFn<Task.Record>
): Task.Async {
  return create(() => {
    const opts: Required<CombineOptions> = shallow(
      { include: null, exclude: null },
      options || undefined
    );

    return into(
      recreate((task, route) => {
        return context(
          (ctx) => ({ ...ctx, route: ctx.route.concat(route) }),
          task
        );
      }, tasks),
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
      (arr) => series(...arr)
    );
  });
}
