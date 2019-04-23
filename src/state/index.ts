import paths, { IPaths } from './paths';
import mergewith from 'lodash.mergewith';
import { IBaseOptions, IScopeOptions, TOptions } from '~/types';
import { DEFAULT_LOG_LEVEL } from '~/constants';
import { setLevel } from '~/utils/logger';
import { lazy } from 'promist';
import load, { ILoaded } from './load';

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

let promise: Promise<IPaths>;
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
  paths(): Promise<IPaths> {
    return promise;
  },
  load(): Promise<ILoaded> {
    return promise.then((paths) => load(paths));
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
  promise = lazy((resolve) => {
    resolve(paths({ file: state.file, directory: state.directory }));
  });
}
