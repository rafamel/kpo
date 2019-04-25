import { IBaseOptions, IScopeOptions, TCoreOptions, IOfType } from '~/types';
import { DEFAULT_LOG_LEVEL } from '~/constants';
import { setLevel } from '~/utils/logger';
import hash from 'object-hash';

export const state = {
  base: {
    file: null,
    directory: null,
    env: {},
    silent: false,
    log: DEFAULT_LOG_LEVEL
  } as IBaseOptions,
  cli: {} as IBaseOptions,
  scope: {} as IScopeOptions
};

let id = 'INIT';
let options: TCoreOptions = {};
merge();

export const raw = (): TCoreOptions => options;
export default {
  get id(): string {
    return id;
  },
  setCli(opts: IBaseOptions): void {
    Object.assign(state.cli, stripUndefined(opts));
    merge();
  },
  setScope(opts: IScopeOptions = {}): void {
    state.scope = opts;
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
  id = hash(options);
}

function stripUndefined(obj: IOfType<any>): IOfType<any> {
  return Object.entries(obj).reduce((acc: IOfType<any>, [key, value]) => {
    if (value !== undefined) acc[key] = value;
    return acc;
  }, {});
}
