import load, { ILoad } from './load';
import { get } from 'slimconf';
import { IOptions, IOfType } from '~/types';
import { DEFAULT_LOG_LEVEL } from '~/constants';
import hash from 'object-hash';

export const states = {
  base: {
    file: undefined,
    directory: undefined,
    env: {},
    silent: false,
    log: DEFAULT_LOG_LEVEL
  } as IOptions,
  scope: {} as Partial<IOptions>
};

const cache: IOfType<ILoad> = {};
let state: IOptions = Object.assign({}, states.base);

export default {
  base(options: IOptions): void {
    Object.assign(states.base, options);
    merge();
  },
  scope(options: IOptions): void {
    states.scope = options;
    merge();
  },
  get(path: keyof IOptions): any {
    return get(state, path, false);
  },
  async load(): Promise<ILoad> {
    const opts = { file: state.file, directory: state.directory };
    const key = hash(opts);
    if (cache.hasOwnProperty(key)) return cache[key];

    return (cache[key] = await load(opts));
  }
};

function merge(): void {
  const env = Object.assign({}, states.base.env, states.scope.env);
  state = Object.assign({}, states.base, states.scope, { env });
}
