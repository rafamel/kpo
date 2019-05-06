import { ICliOptions, IScopeOptions, TCoreOptions, IOfType } from '~/types';
import { DEFAULT_LOG_LEVEL, LOG_ENV_KEY } from '~/constants';
import { setLevel } from '~/utils/logger';
import globals from '~/globals';
import cache from '~/utils/cache';

/* Shared between instances: changes might imply a major version release */
export const state = globals('options', {
  id: 0,
  base: {
    file: null,
    directory: null,
    env: {},
    silent: false,
    log: process.env[LOG_ENV_KEY] || DEFAULT_LOG_LEVEL
  } as TCoreOptions,
  cli: {} as ICliOptions,
  scope: {} as IScopeOptions
}).get();

let options: TCoreOptions = {};
merge();

export default {
  get id(): number {
    return state.id;
  },
  // Raw should only be called from core (after initialization)
  raw: cache(
    () => state.id,
    (): TCoreOptions => {
      merge();
      return Object.assign({}, options);
    }
  ),
  setBase(opts: TCoreOptions): void {
    Object.assign(state.base, opts);
    state.id += 1;
  },
  setCli(opts: ICliOptions): void {
    Object.assign(state.cli, stripUndefined(opts));
    state.id += 1;
  },
  setScope(opts: IScopeOptions = {}): void {
    Object.assign(state.scope, opts);
    state.id += 1;
  },
  resetScope(): void {
    state.scope = {};
    state.id += 1;
  },
  forceUpdate(): void {
    state.id += 1;
  }
};

function merge(): void {
  // merge base and scope
  options = Object.assign({}, state.base, state.scope, state.cli, {
    env: Object.assign({}, state.base.env, state.scope.env, state.cli.env)
  });

  // ensure cli own properties are of cli
  options.file = state.cli.file || state.base.file;
  options.directory = state.cli.directory || state.base.directory;

  // Set logging level
  if (options.log) {
    setLevel(options.log);
    process.env[LOG_ENV_KEY] = options.log;
  }
}

function stripUndefined(obj: IOfType<any>): IOfType<any> {
  return Object.entries(obj).reduce((acc: IOfType<any>, [key, value]) => {
    if (value !== undefined) acc[key] = value;
    return acc;
  }, {});
}
