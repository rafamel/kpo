import { spawn, SpawnOptions, ChildProcess } from 'child_process';
import { DEFAULT_STDIO } from '~/constants';
import logger from '~/utils/logger';
import { rejects } from 'errorish';
import onExit from 'signal-exit';
import uuid from 'uuid/v4';
import { IOfType } from '~/types';

export const processes: IOfType<ChildProcess> = {};

// Kill all dangling child processes on main process exit
onExit(() => Object.values(processes).forEach((p) => p.kill()));

export default async function exec(
  command: string,
  args: string[],
  options?: SpawnOptions
): Promise<void> {
  const opts: SpawnOptions = Object.assign({}, options);

  opts.shell = true;
  if (!opts.stdio) opts.stdio = DEFAULT_STDIO;
  if (!opts.env) opts.env = process.env;

  logger.debug(
    'Executing: ' + command + (args.length ? ` "${args.join('" "')}"` : '')
  );
  const id = uuid();
  const ps = spawn(command, args, opts);
  processes[id] = ps;

  return new Promise((resolve: (arg: void) => void, reject) => {
    ps.on('close', (code: number) => {
      delete processes[id];
      return code
        ? reject(Error(`"${command}" failed with code ${code}`))
        : resolve();
    });
    ps.on('error', (err: any) => {
      delete processes[id];
      return reject(err);
    });
  }).catch(rejects);
}
