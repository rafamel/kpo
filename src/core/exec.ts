import { IOfType } from '~/types';
import _exec from '~/utils/exec';
import manage from 'manage-path';
import manager from '~/utils/ps-manager';

export default async function exec(
  command: string,
  args: string[],
  fork: boolean,
  cwd: string,
  bin: string[],
  env?: IOfType<string> | undefined
): Promise<void> {
  const opts = {
    cwd,
    env: Object.assign({}, process.env, env)
  };
  const alter = manage(opts.env);
  alter.unshift(bin);

  const { ps, promise } = _exec(command, args, fork, opts);
  manager.add(ps.pid, promise);
  return promise;
}
