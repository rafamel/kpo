import sc from 'spawn-command';
import ensure from './ensure';
import clone from 'lodash.clone';
import { ChildProcess, SpawnOptions } from 'child_process';
import { DEFAULT_STDIO } from '~/constants';

export interface IExec {
  ps: ChildProcess;
  promise: Promise<void>;
}

export default function exec(command: string, options: SpawnOptions): IExec {
  const opts: SpawnOptions = options ? Object.assign({}, options) : {};

  if (!opts.stdio) opts.stdio = DEFAULT_STDIO;
  if (!opts.env) opts.env = clone(process.env);

  const ps = sc(command, opts);
  return {
    ps,
    promise: new Promise((resolve, reject) => {
      ps.on('close', (code: number) => {
        return code ? reject(Error(`Failed: ${command}`)) : resolve();
      });
      ps.on('error', (err: any) => {
        return reject(ensure.error(err));
      });
    })
  };
}
