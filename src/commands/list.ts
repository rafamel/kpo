import path from 'path';
import table from 'as-table';
import chalk from 'chalk';
import core from '~/core';
import { ITasks, ITask } from '~/core/types';
import logger from '~/utils/logger';

export default async function list(opts: {
  all?: boolean;
  scopes?: boolean;
}): Promise<void> {
  let tasks = Object.assign({}, await core.tasks());
  if (!opts.all) {
    if (tasks.kpo) tasks.kpo = tasks.kpo.filter((task) => !task.hidden);
    if (tasks.pkg) tasks.pkg = tasks.pkg.filter((task) => !task.hidden);
  }
  // eslint-disable-next-line no-console
  console.log(fromTasks(tasks));
  if (opts.scopes) console.log(await fromScopes());
}

export function fromTasks(tasks: ITasks): string {
  let str = '';

  [['kpo', 'kpo'], ['pkg', 'package']].forEach(([key, name]) => {
    if (!tasks.hasOwnProperty(key) || !(tasks as any)[key].length) return;

    const rows = (tasks as any)[key].map((task: ITask) => [
      chalk.bold(task.path),
      task.description || ''
    ]);

    str +=
      chalk.bold.green(`\n${name}:\n`) +
      table
        .configure({ delimiter: ' '.repeat(8) })(rows)
        .trim() +
      '\n';
  });

  return str;
}

export async function fromScopes(): Promise<string> {
  const paths = await core.paths();
  const root = await core.root();
  const scopes = await core.children();

  let rows = scopes.map((child) => [
    path.parse(child.directory).name,
    path.relative(paths.directory, child.directory)
  ]);
  if (root) {
    rows.unshift(['root', path.relative(paths.directory, root.directory)]);
  }

  const nonUnique = rows
    .map((scope) => scope[0])
    .filter((x, i, arr) => arr.indexOf(x) !== i);
  if (nonUnique.length) {
    logger.debug(`Non unique names: ${nonUnique.join(', ')}`);
    throw Error(`Scope names conflict`);
  }

  rows = rows.map(([name, dir]) => [chalk.bold('@' + name), dir + '/']);
  return (
    chalk.bold.yellow(`scopes:\n`) +
    table
      .configure({ delimiter: ' '.repeat(4) })(rows)
      .trim() +
    '\n'
  );
}
