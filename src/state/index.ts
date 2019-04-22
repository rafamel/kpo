import load, { ILoad } from './load';
import { get } from 'slimconf';
import mergewith from 'lodash.mergewith';
import { IOptions } from '~/types';
import { DEFAULT_LOG_LEVEL } from '~/constants';
import { setLevel } from '~/utils/logger';
import { lazy } from 'promist';

export interface IConfig {
  load: ILoad;
}

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

let config: Promise<IConfig>;
let state: IOptions = {};
merge();

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
  load(): Promise<ILoad> {
    return config.then((x) => x.load);
  }
};

function merge(): void {
  state = Object.assign({}, states.base, states.scope, {
    env: Object.assign({}, states.base.env, states.scope.env)
  });
  if (state.log) setLevel(state.log);
  config = lazy((resolve) => resolve(getConfig()));
}

async function getConfig(): Promise<IConfig> {
  const res = await load({
    file: state.file,
    directory: state.directory
  });

  return {
    load: res
  };
}
