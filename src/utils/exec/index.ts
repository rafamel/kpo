import sc from 'spawn-command';
import { SpawnOptions } from 'child_process';
import { DEFAULT_STDIO } from '~/constants';
import logger from '~/utils/logger';
import { rejects } from 'errorish';
import getEnv from './get-env';

export default async function exec(
  command: string,
  options?: SpawnOptions
): Promise<void> {
  const opts: SpawnOptions = Object.assign({}, options);

  if (!opts.stdio) opts.stdio = DEFAULT_STDIO;
  if (!opts.env) opts.env = await getEnv();

  logger.debug('Executing: ' + command);
  const ps = sc(command, opts);

  return new Promise((resolve: (arg: void) => void, reject) => {
    ps.on('close', (code: number) => {
      return code ? reject(Error(`Failed: ${command}`)) : resolve();
    });
    ps.on('error', (err: any) => reject(err));
  }).catch(rejects);
}
