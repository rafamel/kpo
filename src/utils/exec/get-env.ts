import state from '~/state';
import manage from 'manage-path';
import { IOfType } from '~/types';

export default async function getEnv(): Promise<IOfType<string | undefined>> {
  const env: IOfType<string | undefined> = Object.assign(
    {},
    process.env,
    state.get('env')
  );
  const alter = manage(env);
  alter.unshift(await state.paths().then((paths) => paths.bin));

  return env;
}
