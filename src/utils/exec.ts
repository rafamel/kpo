import {
  spawn,
  fork,
  SpawnOptions,
  ChildProcess,
  ForkOptions
} from 'child_process';
import { DEFAULT_STDIO } from '~/constants';
import logger from '~/utils/logger';
import { rejects } from 'errorish';
import onExit from 'signal-exit';
import uuid from 'uuid/v4';
import join from 'command-join';
import { IOfType, IExecOptions } from '~/types';

export const processes: IOfType<ChildProcess> = {};

// Kill all dangling child processes on main process exit
onExit(() => Object.values(processes).forEach((p) => p.kill()));

export default async function exec(
  cmd: string,
  args: string[],
  fork: boolean,
  options: IExecOptions = {}
): Promise<void> {
  const opts: SpawnOptions | ForkOptions = {
    cwd: options.cwd,
    env: options.env,
    stdio: options.stdio
  };

  if (!fork) (opts as SpawnOptions).shell = true;
  return trunk(cmd, args, fork, opts);
}

export async function trunk(
  command: string,
  args: string[],
  isFork: boolean,
  options: SpawnOptions | ForkOptions
): Promise<void> {
  if (!options.stdio) options.stdio = DEFAULT_STDIO;
  if (!options.env) options.env = process.env;

  logger.debug('Executing: ' + join([command].concat(args)));
  const id = uuid();
  const ps = isFork
    ? fork(command, args, options)
    : spawn(command, args, options);
  processes[id] = ps;

  return new Promise((resolve: (arg: void) => void, reject) => {
    ps.on('close', (code: number) => {
      delete processes[id];
      return code
        ? reject(Error(`${join([command])} failed with code ${code}`))
        : resolve();
    });
    ps.on('error', (err: any) => {
      delete processes[id];
      return reject(err);
    });
  }).catch(rejects);
}
