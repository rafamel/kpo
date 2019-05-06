import logger from '~/utils/logger';
import chalk from 'chalk';
import core from '~/core';
import expose from '~/utils/expose';

export default expose(run);

/**
 * Runs a *kpo* task or group of tasks in the project context.
 * It is an *exposed* function: call `run.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function -hence, calling `run` won't have any effect until the returned function is called.
 */
function run(tasks: string | string[]): (args?: string[]) => Promise<void> {
  return async (args?: string[]) => {
    if (!tasks) throw Error(`No tasks to run`);
    if (!Array.isArray(tasks)) tasks = [tasks];
    if (!tasks.length) throw Error(`No tasks to run`);

    if (tasks.find((x) => x[0] === ':')) {
      throw Error(
        `Using : at the beggining of task names is forbidden -reserved for kpo commands`
      );
    }
    if (tasks.find((x) => x[0] === '@')) {
      throw Error(
        `Using @ at the beginning of task names is forbidden -reserved for kpo scopes`
      );
    }

    for (let path of tasks) {
      const task = await core().task(path);
      logger.info('Running ' + chalk.bold.green(task.path));
      await core().run(task.script, args || []);
      logger.debug('Done with task: ' + task.path);
    }
  };
}
