import { Task, Context } from '../../definitions';
import { parseToArray } from '../../helpers/parse';
import { styleString } from '../../helpers/style-string';
import { getTaskRecord } from '../../helpers/get-task-record';
import { constants } from '../../constants';
import { print } from '../stdio/print';
import { Empty } from 'type-core';
import { shallow } from 'merge-strategies';
import { into } from 'pipettes';
import table from 'as-table';

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
  tasks?: Task.Record | Empty,
  options?: ListOptions | Empty,
  map?: (name: string, route: string[]) => string[]
): Task.Async {
  return async (ctx: Context): Promise<void> => {
    const opts = shallow(
      { defaults: false, bin: constants.bin },
      options || undefined
    );

    const source = await getTaskRecord(tasks);
    const items = parseToArray(
      { roots: true, defaults: opts.defaults },
      source
    );
    const maxRouteLength = items.reduce(
      (acc, item) => (acc > item.route.length ? acc : item.route.length),
      0
    );

    const rows = map
      ? items.map((item) => map(item.name, item.route))
      : items.map((item) => {
          return [
            opts.bin +
              ' ' +
              styleString(item.name, { bold: true }) +
              ' '.repeat(4),
            ...Array(item.route.length).fill(''),
            item.route[item.route.length - 1],
            ...Array(maxRouteLength - item.route.length).fill('')
          ];
        });

    into(
      ctx,
      print(
        table
          .configure({ delimiter: ' '.repeat(2) })(rows)
          .trim()
      )
    );
  };
}
