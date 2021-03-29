import { Task, Context } from '../../definitions';
import { parseToArray } from '../../helpers/parse';
import { print } from '../stdio/print';
import { Empty } from 'type-core';
import { into } from 'pipettes';
import table from 'as-table';
import chalk from 'chalk';

export interface ListOptions {
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
  tasks: Task.Record,
  options?: ListOptions | Empty,
  map?: (name: string, route: string[]) => string[]
): Task.Sync {
  return (ctx: Context): void => {
    const opts = Object.assign({ bin: 'kpo' }, options);
    const items = parseToArray(tasks);
    const maxRouteLength = items.reduce(
      (acc, item) => (acc > item.route.length ? acc : item.route.length),
      0
    );

    const rows = map
      ? items.map((item) => map(item.name, item.route))
      : items.map((item) => {
          return [
            (opts.bin ? `${opts.bin} ` : '') +
              chalk.bold(item.name) +
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
