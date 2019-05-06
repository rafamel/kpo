import { spawn, fork as _fork, SpawnOptions, ForkOptions } from 'child_process';
import { DEFAULT_STDIO } from '~/constants';
import logger from '~/utils/logger';
import join from 'command-join';
import { IExecOptions } from '~/types';
import { absolute } from './file';
import manager, { EnvManager } from '~/utils/env-manager';
import path from 'path';
import getBinPaths from './paths';
import guardian from './guardian';

export default async function exec(
  cmd: string,
  args: string[],
  fork: boolean,
  options: IExecOptions = {}
): Promise<void> {
  // Fail if main process is already exiting
  guardian();

  const env = Object.assign({}, process.env);
  const local = new EnvManager(env);

  const cwd = options.cwd
    ? absolute({ path: options.cwd, cwd: process.cwd() })
    : process.cwd();

  if (path.relative(cwd, process.cwd())) {
    local.assign({ [local.path]: manager.purePaths });
    local.addPaths(await getBinPaths(cwd));
  }
  if (options.env) local.assign(options.env);
  if (options.paths && options.paths.length) {
    local.addPaths(options.paths);
  }

  const opts: SpawnOptions | ForkOptions = {
    cwd,
    env,
    shell: fork ? undefined : true,
    stdio: options.stdio || DEFAULT_STDIO
  };

  logger.debug('Executing: ' + join([cmd].concat(args)));

  const ps = fork ? _fork(cmd, args, opts) : spawn(cmd, args, opts);
  const promise = new Promise((resolve: (arg: void) => void, reject) => {
    ps.on('error', (err: any) => reject(err));
    ps.on('close', (code: number) => {
      return code
        ? reject(Error(`Process failed with code ${code}: ${join([cmd])}`))
        : resolve();
    });
  });

  return promise;
}
