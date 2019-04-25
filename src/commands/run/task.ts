import { TScript } from '~/types';
import logger from '~/utils/logger';
import chalk from 'chalk';
import core from '~/core';
import { open } from '~/utils/errors';

export default async function runTask(path: string): Promise<void> {
  const task = await core.task(path);
  logger.info('\nRunning task: ' + chalk.bold.green(task.path));
  await trunk(task.script);
  logger.debug('Done with task: ' + task.path);
}

export async function trunk(script: TScript): Promise<void> {
  if (!script) {
    logger.debug('Empty task');
    return;
  }
  if (typeof script === 'string') {
    logger.debug('Command exec: ' + script);
    return core.exec(script);
  }
  if (typeof script === 'function') {
    logger.debug('Run function' + (script.name ? ` ${script.name}` : ''));
    let res: TScript;
    try {
      res = await script();
    } catch (err) {
      throw open.ensure(err);
    }
    return trunk(res);
  }
  if (Array.isArray(script)) {
    for (let sub of script) {
      await trunk(sub);
    }
    return;
  }
  throw Error(`Task wasn't a TScript`);
}
