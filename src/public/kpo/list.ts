import path from 'path';
import table from 'as-table';
import chalk from 'chalk';
import core from '~/core';
import { ITasks, ITask } from '~/core/types';
import logger from '~/utils/logger';
import expose from '~/utils/expose';

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

export default expose(list);

/**
 * Lists *kpo* tasks in the project context.
 * It is an *exposed* function: call `list.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function -hence, calling `list` won't have any effect until the returned function is called.
 */
function list(options: IListOptions = {}): () => Promise<void> {
  return async () => {
    let tasks = Object.assign({}, await core.tasks());
    if (!options.all) {
      if (tasks.kpo) tasks.kpo = tasks.kpo.filter((task) => !task.hidden);
      if (tasks.pkg) tasks.pkg = tasks.pkg.filter((task) => !task.hidden);
    }

    // eslint-disable-next-line no-console
    console.log(
      fromTasks(tasks) + (options.scopes ? '\n' + (await fromScopes()) : '')
    );
  };
}

/** @hidden */
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

/** @hidden */
export async function fromScopes(): Promise<string> {
  const cwd = await core.cwd();
  const root = await core.root();
  const scopes = await core.children();

  let rows = scopes.map((child) => [
    child.name,
    path.relative(cwd, child.directory)
  ]);
  if (root) {
    rows.unshift(['root', path.relative(cwd, root.directory)]);
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
