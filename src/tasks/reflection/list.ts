import { Task, Context } from '../../definitions';
import { parseToArray } from '../../helpers/parse';
import { print } from '../stdio/print';
import { into } from 'pipettes';
import table from 'as-table';
import chalk from 'chalk';

/**
 * Prints all available tasks in a `tasks` record
 * on a context's stdout.
 * @returns Task
 */
export function list(tasks: Task.Record): Task.Sync {
  return (ctx: Context): void => {
    const items = parseToArray(tasks);
    const maxRouteLength = items.reduce(
      (acc, item) => (acc > item.route.length ? acc : item.route.length),
      0
    );

    const rows = items.map((item) => {
      return [
        'kpo ' + chalk.bold(item.name) + ' '.repeat(4),
        ...Array(item.route.length).fill(''),
        item.route[item.route.length - 1],
        ...Array(maxRouteLength - item.route.length).fill('')
      ];
    });

    into(
      ctx,
      print(
        table
          .configure({ delimiter: '  ' })(rows)
          .trim()
      )
    );
  };
}
