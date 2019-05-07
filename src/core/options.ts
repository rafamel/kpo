import hash from 'object-hash';
import { DEFAULT_LOG_LEVEL } from '~/constants';
import { setLevel } from '~/utils/logger';
import environmentals from '~/utils/environmentals';
import { ICliOptions, IScopeOptions, TCoreOptions, IOfType } from '~/types';

export const state = {
  force: 0,
  base: {
    file: null,
    directory: null,
    env: {},
    silent: false,
    log: environmentals.default('kpo_log', DEFAULT_LOG_LEVEL)
  } as TCoreOptions,
  cli: {} as ICliOptions,
  scope: {} as IScopeOptions
};

let id = '';
let options: TCoreOptions = {};
merge();

export default {
  get id(): string {
    return id;
  },
  get<T extends keyof TCoreOptions>(key: T): TCoreOptions[T] {
    return options[key];
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
    state.force += 1;
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
  if (options.log) {
    setLevel(options.log);
    environmentals.set('kpo_log', options.log);
  }

  id = hash(options) + state.force;
}

function stripUndefined(obj: IOfType<any>): IOfType<any> {
  return Object.entries(obj).reduce((acc: IOfType<any>, [key, value]) => {
    if (value !== undefined) acc[key] = value;
    return acc;
  }, {});
}
