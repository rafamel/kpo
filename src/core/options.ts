import { ICliOptions, IScopeOptions, TCoreOptions, IOfType } from '~/types';
import { DEFAULT_LOG_LEVEL } from '~/constants';
import { setLevel } from '~/utils/logger';
import hash from 'object-hash';

export const state = {
  base: {
    force: 0,
    file: null,
    directory: null,
    env: {},
    silent: false,
    log: DEFAULT_LOG_LEVEL
  } as TCoreOptions,
  cli: {} as ICliOptions,
  scope: {} as IScopeOptions
};

let id = 'INIT';
if (!process.env.KPO_STATE_ID) process.env.KPO_STATE_ID = id;

let options: TCoreOptions = {};

export default {
  get id(): string {
    return id;
  },
  raw(): TCoreOptions {
    if (id === 'INIT') merge();
    return Object.assign({}, options);
  },
  setBase(opts: TCoreOptions, verify?: 'post' | 'pre'): void {
    Object.assign(state.base, stripUndefined(opts));
    merge(verify);
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
    state.base.force = state.base.force ? state.base.force + 1 : 0;
    merge();
  }
};

function merge(verify: 'post' | 'pre' = 'pre'): void {
  if (verify === 'pre') verifyId();

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
  if (verify === 'post') verifyId();
  process.env.KPO_STATE_ID = id;
}

function stripUndefined(obj: IOfType<any>): IOfType<any> {
  return Object.entries(obj).reduce((acc: IOfType<any>, [key, value]) => {
    if (value !== undefined) acc[key] = value;
    return acc;
  }, {});
}

function verifyId(): void {
  if (id !== process.env.KPO_STATE_ID) {
    throw Error(
      `Locally imported kpo instance doesn't match executing instance`
    );
  }
}
