import mergewith from 'lodash.mergewith';
import { IBaseOptions, IScopeOptions, TCoreOptions } from '~/types';
import { DEFAULT_LOG_LEVEL } from '~/constants';
import { setLevel } from '~/utils/logger';
import uuid from 'uuid/v4';

export const state = {
  base: {
    file: null,
    directory: null,
    env: {},
    silent: false,
    log: DEFAULT_LOG_LEVEL
  } as IBaseOptions,
  scope: {} as IScopeOptions
};

let id = uuid();
let options: TCoreOptions = {};
merge();

export default {
  get id(): string {
    return id;
  },
  get<T extends keyof TCoreOptions>(key: T): TCoreOptions[T] {
    return options[key];
  },
  setBase(options: IBaseOptions): void {
    mergewith(state.base, options, (obj, src) => {
      if (obj === 'undefined') return src;
    });
    merge();
  },
  setScope(options: IScopeOptions = {}): void {
    state.scope = options;
    merge();
  }
};

function merge(): void {
  // reset id
  id = uuid();

  // merge base and scope
  options = Object.assign({}, state.base, state.scope, {
    env: Object.assign({}, state.base.env, state.scope.env)
  });

  // ensure base own properties are of base
  options.file = state.base.file;
  options.directory = state.base.directory;

  // Set logging level
  if (options.log) setLevel(options.log);
}
