import sc from 'spawn-command';
import { ChildProcess, SpawnOptions } from 'child_process';
import { DEFAULT_STDIO } from '~/constants';
import logger from '~/utils/logger';
import { rejects } from 'errorish';

export interface IExec {
  ps: ChildProcess;
  promise: Promise<void>;
}

export default function exec(command: string, options?: SpawnOptions): IExec {
  const opts: SpawnOptions = options ? Object.assign({}, options) : {};

  if (!opts.stdio) opts.stdio = DEFAULT_STDIO;
  if (!opts.env) opts.env = Object.assign({}, process.env);

  logger.debug('Executing: ' + command);
  const ps = sc(command, opts);
  return {
    ps,
    promise: new Promise((resolve: (arg: void) => void, reject) => {
      ps.on('close', (code: number) => {
        return code ? reject(Error(`Failed: ${command}`)) : resolve();
      });
      ps.on('error', (err: any) => reject(err));
    }).catch(rejects)
  };
}
