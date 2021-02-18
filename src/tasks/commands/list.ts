import { Task, Context } from '../../definitions';
import { parseRecord } from '../../helpers/parse-record';
import { print } from '../create/print';
import { into } from 'pipettes';
import chalk from 'chalk';

export function list(tasks: Task.Record): Task.Sync {
  return (ctx: Context): void => {
    const str = parseRecord(tasks)
      .map((item) => {
        return ' '.repeat((item.route.length - 1) * 2) + item.name;
      })
      .map((str) => chalk.bold(str))
      .join('\n');

    into(ctx, print(str));
  };
}
