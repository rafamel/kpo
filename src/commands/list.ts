import path from 'path';
import table from 'as-table';
import chalk from 'chalk';
import { ICore } from '~/core';
import { ITasks, ITask } from '~/core/types';
import logger from '~/utils/logger';

export interface IListOptions {
  /**
   * List all, including hidden tasks
   */
  all?: boolean;
  /**
   * List scopes
   */
  scopes?: boolean;
}

/**
 * Lists *kpo* tasks in the project context.
 */
export default async function list(
  core: ICore,
  options: IListOptions = {}
): Promise<void> {
  const tasks = Object.assign({}, core.tasks);
  if (!options.all) {
    if (tasks.kpo) tasks.kpo = tasks.kpo.filter((task) => !task.hidden);
    if (tasks.pkg) tasks.pkg = tasks.pkg.filter((task) => !task.hidden);
  }

  // eslint-disable-next-line no-console
  console.log(
    fromTasks(tasks) + (options.scopes ? '\n' + (await fromScopes(core)) : '')
  );
}

export function fromTasks(tasks: ITasks): string {
  let str = '';

  [['kpo', 'kpo'], ['pkg', 'package']].forEach(([key, name]) => {
    if (
      !Object.hasOwnProperty.call(tasks, key) ||
      !(tasks as any)[key].length
    ) {
      return;
    }

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

export async function fromScopes(core: ICore): Promise<string> {
  const scopes = await core.children;

  let rows = scopes.map((child) => [
    child.name,
    path.relative(core.paths.directory, child.directory)
  ]);
  if (core.root) {
    rows.unshift([
      'root',
      path.relative(core.paths.directory, core.root.directory)
    ]);
  }

  const nonUnique = rows
    .map((scope) => scope[0])
    .filter((x, i, arr) => arr.indexOf(x) !== i);
  if (nonUnique.length) {
    logger.debug(`Non unique names: ${nonUnique.join(', ')}`);
    throw Error(`Scope names conflict`);
  }

  rows = rows.map(([name, dir]) => [chalk.bold('@' + name), './' + dir]);
  return (
    chalk.bold.yellow(`scopes:\n`) +
    table
      .configure({ delimiter: ' '.repeat(4) })(rows)
      .trim() +
    '\n'
  );
}
