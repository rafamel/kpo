import mergewith from 'lodash.mergewith';
import { IBaseOptions, IScopeOptions, TCoreOptions } from '~/types';
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
  setBase(opts: IBaseOptions): void {
    mergewith(state.base, opts, (obj, src) => {
      if (obj === 'undefined') return src;
    });
    merge();
  },
  setScope(opts: IScopeOptions = {}): void {
    state.scope = opts;
    merge();
  }
};

function merge(): void {
  // merge base and scope
  options = Object.assign({}, state.base, state.scope, {
    env: Object.assign({}, state.base.env, state.scope.env)
  });

  // ensure base own properties are of base
  options.file = state.base.file;
  options.directory = state.base.directory;

  // Set logging level
  if (options.log) setLevel(options.log);

  // Set id to object hash
  id = hash(options);
}
