import logger from '~/utils/logger';
import chalk from 'chalk';
import core from '~/core';

export default async function run(
  tasks: string[],
  args: string[]
): Promise<void> {
  if (!tasks || !tasks.length) throw Error(`No tasks to run`);
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
    const task = await core.task(path);
    logger.info('\nRunning task: ' + chalk.bold.green(task.path));
    await core.run(task.script, args);
    logger.debug('Done with task: ' + task.path);
  }
}
