import {
  spawn,
  fork as _fork,
  SpawnOptions,
  ChildProcess,
  ForkOptions
} from 'child_process';
import { DEFAULT_STDIO } from '~/constants';
import logger from '~/utils/logger';
import join from 'command-join';
import { IExecOptions } from '~/types';
import { rejects } from 'errorish';

export default function exec(
  cmd: string,
  args: string[],
  fork: boolean,
  options: IExecOptions = {}
): { ps: ChildProcess; promise: Promise<void> } {
  const opts: SpawnOptions | ForkOptions = {
    shell: fork ? undefined : true,
    cwd: options.cwd,
    env: options.env || process.env,
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
  }).catch(rejects);

  return { ps, promise };
}
