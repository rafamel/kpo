import load, { ILoad } from './load';
import mergewith from 'lodash.mergewith';
import { IBaseOptions, IScopeOptions, TOptions } from '~/types';
import { DEFAULT_LOG_LEVEL } from '~/constants';
import { setLevel } from '~/utils/logger';
import { lazy } from 'promist';
import up from 'find-up';

export interface IConfig {
  load: ILoad;
  paths: string[];
}

export const states = {
  base: {
    file: undefined,
    directory: undefined,
    env: {},
    silent: false,
    log: DEFAULT_LOG_LEVEL
  } as IBaseOptions,
  scope: {} as IScopeOptions
};

let config: Promise<IConfig>;
let state: TOptions = {};
merge();

export default {
  base(options: IBaseOptions): void {
    mergewith(states.base, options, (obj, src) => {
      if (obj === 'undefined') return src;
    });
    merge();
  },
  scope(options: IScopeOptions): void {
    states.scope = options;
    merge();
  },
  get(key: keyof TOptions): any {
    return state[key];
  },
  load(): Promise<ILoad> {
    return config.then((x) => x.load);
  },
  paths(): Promise<string[]> {
    return config.then((x) => x.paths);
  }
};

function merge(): void {
  // merge base and scope
  state = Object.assign({}, states.base, states.scope, {
    env: Object.assign({}, states.base.env, states.scope.env)
  });

  // ensure base own properties are of base
  state.file = states.base.file;
  state.directory = states.base.directory;

  // Set logging level
  if (state.log) setLevel(state.log);

  // Set config lazy promise
  config = lazy((resolve) => resolve(getConfig()));
}

async function getConfig(): Promise<IConfig> {
  const res = await load({
    file: state.file,
    directory: state.directory
  });

  return {
    load: res,
    // TODO add root path
    paths: [await up('node_modules/.bin', { cwd: res.directory })].filter(
      (path, i, arr) => path && arr.indexOf(path) === i
    ) as string[]
  };
}
