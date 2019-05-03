import { ICliOptions, IScopeOptions, TCoreOptions, IOfType } from '~/types';
import { DEFAULT_LOG_LEVEL } from '~/constants';
import { setLevel } from '~/utils/logger';
import hash from 'object-hash';

// Option changes should constitute major version changes even if internal,
// as they're overwritten for different kpo instances on core load
export const state = {
  base: {
    file: null,
    directory: null,
    env: {},
    silent: false,
    log: DEFAULT_LOG_LEVEL
  } as TCoreOptions,
  cli: {} as ICliOptions,
  scope: {} as IScopeOptions
};

let id = '';
let force = 0;
let options: TCoreOptions = {};
merge();

export default {
  get id(): string {
    return id;
  },
  // Raw should only be called from core (after initialization)
  get raw(): TCoreOptions {
    return Object.assign({}, options);
  },
  setBase(opts: TCoreOptions): void {
    Object.assign(state.base, opts);
    merge();
  },
  setCli(opts: ICliOptions): void {
    Object.assign(state.cli, stripUndefined(opts));
    merge();
  },
  setScope(opts: IScopeOptions = {}): void {
    Object.assign(state.scope, opts);
    merge();
  },
  resetScope(): void {
    state.scope = {};
    merge();
  },
  forceUpdate(): void {
    force += 1;
    merge();
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
  if (options.log) setLevel(options.log);
  // Set id to object hash
  id = hash(options) + force;
}

function stripUndefined(obj: IOfType<any>): IOfType<any> {
  return Object.entries(obj).reduce((acc: IOfType<any>, [key, value]) => {
    if (value !== undefined) acc[key] = value;
    return acc;
  }, {});
}
