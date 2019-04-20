import { IScripts, IOfType, TScript } from '~/types';
import logger from '~/utils/logger';
import chalk from 'chalk';
import retrieveTask from './retrieve';
import exec from '~/utils/exec';

export default async function runTask(
  name: string,
  kpo: IScripts | null,
  pkg: IOfType<any> | null
): Promise<void> {
  const task = retrieveTask(name, kpo, pkg);

  logger.info('Running task: ' + chalk.bold.green(name));
  await trunk(task);
}

export async function trunk(task: TScript): Promise<void> {
  if (!task) {
    logger.debug('Empty task');
    return;
  }
  if (typeof task === 'string') {
    logger.debug('Command exec: ' + task);
    return exec(task).promise;
  }
  if (typeof task === 'function') {
    logger.debug('Run function' + task.name ? ` ${task.name}` : '');
    return trunk(await task());
  }
  if (Array.isArray(task)) {
    for (let sub of task) {
      await trunk(sub);
    }
  }
  throw Error(`Task wasn't a TScript`);
}
