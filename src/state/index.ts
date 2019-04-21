import load, { ILoad } from './load';
import { get } from 'slimconf';
import mergewith from 'lodash.mergewith';
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
  scope: {} as IOptions
};

let state: IOptions = {};
merge();

const cache: IOfType<ILoad> = {};

export default {
  base(options: IOptions): void {
    mergewith(states.base, options, (obj, src) => {
      if (obj === 'undefined') return src;
    });
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
  state = Object.assign({}, states.base, states.scope, {
    env: Object.assign({}, states.base.env, states.scope.env)
  });
}
