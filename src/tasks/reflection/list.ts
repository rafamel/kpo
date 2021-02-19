import { Task, Context } from '../../definitions';
import { parseToArray } from '../../helpers/parse';
import { print } from '../stdio/print';
import { into } from 'pipettes';
import chalk from 'chalk';

export function list(tasks: Task.Record): Task.Sync {
  return (ctx: Context): void => {
    const str = parseToArray(tasks)
      .map((item) => {
        return ' '.repeat((item.route.length - 1) * 2) + item.name;
      })
      .map((str) => chalk.bold(str))
      .join('\n');

    into(ctx, print(str));
  };
}
