import { SpawnOptions } from 'child_process';
import { DEFAULT_STDIO, NODE_PATH } from '~/constants';
import logger from '~/utils/logger';
import join from 'command-join';
import { IExecOptions } from '~/types';
import { spawn } from 'exits';
import errors from './errors';
import guardian from './guardian';

export default async function exec(
  cmd: string,
  args: string[],
  fork: boolean,
  options: IExecOptions = {}
): Promise<void> {
  guardian();

  const opts: SpawnOptions = {
    shell: !fork,
    cwd: options.cwd,
    env: options.env || process.env,
    stdio: options.stdio || DEFAULT_STDIO
  };

  logger.debug('Executing: ' + join([cmd].concat(args)));

  const { promise } = fork
    ? spawn(NODE_PATH, [cmd].concat(args), opts)
    : spawn(cmd, args, opts);

  await promise.catch(async (err) => {
    throw new errors.CustomError(`Process failed: ${join([cmd])}`, null, err);
  });
}
