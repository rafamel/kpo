import { type Empty, type NullaryFn, TypeGuard } from 'type-core';
import { shallow } from 'merge-strategies';
import table from 'as-table';

import type { Task } from '../../definitions';
import { parseToArray } from '../../helpers/parse';
import { constants } from '../../constants';
import { style } from '../../utils/style';
import { create } from '../creation/create';
import { print } from '../stdio/print';

export interface ListOptions {
  /**
   * List default tasks and subtasks by their own
   */
  defaults?: boolean;
  /**
   * Name of kpo's executable.
   */
  bin?: string;
}

/**
 * Prints all available tasks in a `tasks` record
 * on a context's stdout.
 * @returns Task
 */
export function list(
  options: ListOptions | Empty,
  tasks: Task.Record | NullaryFn<Task.Record>
): Task.Async {
  return create(async () => {
    const opts = shallow(
      { defaults: false, bin: constants.cli.bin },
      options || undefined
    );

    const source = TypeGuard.isFunction(tasks) ? tasks() : tasks;
    const items = parseToArray(
      { roots: true, defaults: opts.defaults },
      source
    );
    const maxRouteLength = items.reduce(
      (acc, item) => (acc > item.route.length ? acc : item.route.length),
      0
    );

    const rows = items.map((item) => {
      return [
        opts.bin + ' ' + style(item.name, { bold: true }) + ' '.repeat(4),
        ...Array.from({ length: item.route.length }).fill(''),
        item.route[item.route.length - 1],
        ...Array.from({ length: maxRouteLength - item.route.length }).fill('')
      ];
    });

    return print(
      table
        .configure({ delimiter: ' '.repeat(2) })(rows)
        .trim()
    );
  });
}
