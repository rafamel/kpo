import { ICliOptions, IScopeOptions, TCoreOptions, IOfType } from '~/types';
import { DEFAULT_LOG_LEVEL } from '~/constants';
import { setLevel } from '~/utils/logger';
import environmentals from '~/utils/environmentals';
import initialize from './initialize';

export const state = {
  id: 0,
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

let options: TCoreOptions = {};
merge();

export default {
  get id(): number {
    return state.id;
  },
  get<T extends keyof TCoreOptions>(key: T): TCoreOptions[T] {
    return options[key];
  },
  async setCli(opts: ICliOptions): Promise<void> {
    Object.assign(state.cli, stripUndefined(opts));
    state.id += 1;
    merge();
    await initialize();
  },
  async setScope(opts: IScopeOptions = {}): Promise<void> {
    Object.assign(state.scope, opts);
    state.id += 1;
    merge();
    await initialize();
  },
  async resetScope(update: boolean): Promise<void> {
    state.scope = {};
    state.id += 1;
    if (update) {
      merge();
      await initialize();
    }
  },
  async forceUpdate(): Promise<void> {
    state.id += 1;
    await initialize();
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
}

function stripUndefined(obj: IOfType<any>): IOfType<any> {
  return Object.entries(obj).reduce((acc: IOfType<any>, [key, value]) => {
    if (value !== undefined) acc[key] = value;
    return acc;
  }, {});
}
