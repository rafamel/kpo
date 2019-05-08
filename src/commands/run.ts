import logger from '~/utils/logger';
import chalk from 'chalk';
import { ICore } from '~/core';
import { TScript } from '~/types';
import guardian from '~/utils/guardian';
import exec from '~/utils/exec';
import { open } from '~/utils/errors';

/**
 * Runs a *kpo* task or group of tasks.
 */
export default async function run(
  core: ICore,
  tasks: string | string[],
  args: string[] = []
): Promise<void> {
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
    const task = await core.task(path);
    logger.info('Running ' + chalk.bold.green(task.path));

    await core.initialize();
    await runner(task.script, core, args);
    core.restore();

    logger.debug('Done with task: ' + task.path);
  }
}

export async function runner(
  script: TScript,
  core: ICore,
  args: string[]
): Promise<void> {
  guardian();

  if (!script) {
    logger.debug('Empty task');
  } else if (script instanceof Error) {
    throw script;
  } else if (typeof script === 'string') {
    logger.debug('Command exec: ' + script);
    await exec(script, args, false);
  } else if (typeof script === 'function') {
    logger.debug('Run function' + (script.name ? ` ${script.name}` : ''));
    let res: TScript;
    try {
      res = await script(args);
    } catch (err) {
      throw open(err);
    }
    await runner(res, core, args);
  } else if (Array.isArray(script)) {
    for (let sub of script) {
      await runner(sub, core, args);
    }
  } else {
    throw Error(`Task wasn't a TScript`);
  }
}
