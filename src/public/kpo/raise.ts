import fs from 'fs-extra';
import core, { options as _options } from '~/core';
import toArgv from 'string-argv';
import { IOfType } from '~/types';
import chalk from 'chalk';
import logger from '~/utils/logger';
import expose from '~/utils/expose';
import confirm from '~/utils/confirm';
import { rejects } from 'errorish';

export interface IRaiseOptions {
  /**
   * Prompt for changes confirmation before performing a write operation
   */
  confirm?: boolean;
  /**
   * Dry run
   */
  dry?: boolean;
  /**
   * Fails if there are any changes to be made on dry mode, or if the user cancels the action when confirmation is required
   */
  fail?: boolean;
}

export default expose(raise);

/**
 * Raises *kpo* tasks to the `package.json` in the project context.
 * It is an *exposed* function: call `raise.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function -hence, calling `raise` won't have any effect until the returned function is called.
 */
function raise(options: IRaiseOptions = {}): () => Promise<void> {
  return async () => {
    if (options.confirm && options.dry) {
      throw Error(`raise can't be run with both confirm and dry options`);
    }
    if (options.fail && (!options.confirm && !options.dry)) {
      throw Error(
        `raise can't be run in fail mode without confirm or dry options`
      );
    }

    const paths = await core.paths();
    const { pkg } = await core.load();

    if (!paths.kpo) throw Error(`No kpo scripts found`);
    if (!paths.pkg || !pkg) throw Error(`No package.json found`);

    const tasks = await core.tasks();
    const taskNames = (tasks.kpo || [])
      .filter((task) => !task.hidden)
      .map((task) => task.path);

    const scripts: IOfType<string> = pkg.scripts || {};

    const selected = Object.keys(scripts).filter((key) => {
      const value = scripts[key];
      let argv = toArgv(value);
      if (argv.shift() !== 'kpo') return false;
      if (argv[0] === ':run') argv.shift();
      return (
        argv.length === 1 &&
        argv[0][0] !== ':' &&
        argv[0][0] !== '@' &&
        argv[0] === key
      );
    });
    const nonSelected = Object.keys(scripts).filter(
      (key) => !selected.includes(key)
    );

    const toAdd = taskNames.filter((key) => !selected.includes(key));
    const toRemove = selected
      .filter((key) => !taskNames.includes(key))
      .concat(Object.keys(scripts).filter((key) => toAdd.includes(key)));

    let msg = chalk.bold('No pending scripts changes');
    if (toRemove.length || toAdd.length) {
      msg = toRemove.length
        ? chalk.bold.yellow('Scripts to remove: ') + toRemove.join(', ')
        : chalk.bold('No scripts to remove');
      msg +=
        '\n' +
        (toAdd.length
          ? chalk.bold.yellow('Scripts to add: ') + toAdd.join(', ')
          : chalk.bold('No scripts to add'));
    }

    // eslint-disable-next-line no-console
    (options.confirm || options.dry ? console.log : logger.info)(msg);

    if (!toRemove.length && !toAdd.length) return;
    if (options.dry) {
      if (options.fail) throw Error(`There are pending scripts changes`);
      return;
    }

    if (!(await confirm('Confirm?', options))) return;

    pkg.scripts = {
      ...nonSelected.reduce((acc: IOfType<string>, key) => {
        acc[key] = scripts[key];
        return acc;
      }, {}),
      ...taskNames.reduce((acc: IOfType<string>, key) => {
        acc[key] = `kpo ${key}`;
        return acc;
      }, {})
    };

    await fs.writeFile(paths.pkg, JSON.stringify(pkg, null, 2)).catch(rejects);
    _options.forceUpdate();
  };
}
