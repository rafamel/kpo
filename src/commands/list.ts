import table from 'as-table';
import chalk from 'chalk';
import core from '~/core';
import { ITasks, ITask } from '~/core/types';

export default async function list(opts: { all?: boolean }): Promise<void> {
  let tasks = Object.assign({}, await core.tasks());
  if (!opts.all) {
    if (tasks.kpo) tasks.kpo = tasks.kpo.filter((task) => !task.hidden);
    if (tasks.pkg) tasks.pkg = tasks.pkg.filter((task) => !task.hidden);
  }
  // eslint-disable-next-line no-console
  console.log(printer(tasks));
}

export function printer(tasks: ITasks): string {
  let str = '';

  [['kpo', 'Kpo'], ['pkg', 'Package']].forEach(([key, name]) => {
    if (!tasks.hasOwnProperty(key) || !(tasks as any)[key].length) return;

    const rows = (tasks as any)[key].map((task: ITask) => [
      chalk.bold(task.path),
      task.description || ''
    ]);

    str +=
      chalk.bold.green(`\n${name} tasks:\n`) +
      table
        .configure({ delimiter: ' '.repeat(8) })(rows)
        .trim() +
      '\n';
  });

  return str;
}
