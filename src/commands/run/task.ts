import { IScripts, IOfType, TScript } from '~/types';
import logger from '~/utils/logger';
import chalk from 'chalk';
import retrieveTask from './retrieve';
import core from '~/core';
import { open } from '~/utils/errors';

export default async function runTask(
  name: string,
  kpo: IScripts | null,
  pkg: IOfType<any> | null
): Promise<void> {
  const task = retrieveTask(name, kpo, pkg);
  logger.info('\nRunning task: ' + chalk.bold.green(name));
  await trunk(task);
  logger.debug('Done with task: ' + name);
}

export async function trunk(task: TScript): Promise<void> {
  if (!task) {
    logger.debug('Empty task');
    return;
  }
  if (typeof task === 'string') {
    logger.debug('Command exec: ' + task);
    return core.exec(task);
  }
  if (typeof task === 'function') {
    logger.debug('Run function' + (task.name ? ` ${task.name}` : ''));
    let res: TScript;
    try {
      res = await task();
    } catch (err) {
      throw open.ensure(err);
    }
    return trunk(res);
  }
  if (Array.isArray(task)) {
    for (let sub of task) {
      await trunk(sub);
    }
    return;
  }
  throw Error(`Task wasn't a TScript`);
}
