import manage from 'manage-path';
import { IOfType } from '~/types';
import _exec from '~/utils/exec';

export default async function exec(
  command: string,
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

  return _exec(command, opts);
}
