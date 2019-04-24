import paths from './paths';
import mergewith from 'lodash.mergewith';
import { IBaseOptions, IScopeOptions } from '~/types';
import { DEFAULT_LOG_LEVEL } from '~/constants';
import { setLevel } from '~/utils/logger';
import { lazy } from 'promist';
import load from './load';
import scope from './scope';
import { IPaths, ILoaded } from './types';

export const states = {
  base: {
    file: null,
    directory: null,
    env: {},
    silent: false,
    log: DEFAULT_LOG_LEVEL
  } as IBaseOptions,

  options: {} as IScopeOptions,

  internal: {
    scopes: [] as string[]
  }
};

export type TState = IBaseOptions & IScopeOptions & typeof states.internal;

let promise: Promise<IPaths>;
let state: TState = Object.assign({}, states.internal);
merge();

export default {
  setBase(options: IBaseOptions): void {
    mergewith(states.base, options, (obj, src) => {
      if (obj === 'undefined') return src;
    });
    merge();
  },
  setOptions(options: IScopeOptions = {}): void {
    states.options = options;
    merge();
  },
  async setScope(name: string): Promise<void> {
    const definition = await scope(name);
    if (definition) {
      states.internal.scopes.push(definition.name);
      this.setBase({ file: null, directory: definition.directory });
      this.setOptions();
    }
  },
  get<T extends keyof TState>(key: T): TState[T] {
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
  state = Object.assign({}, states.base, states.options, states.internal, {
    env: Object.assign({}, states.base.env, states.options.env)
  });

  // ensure base own properties are of base
  state.file = states.base.file;
  state.directory = states.base.directory;

  // Set logging level
  if (state.log) setLevel(state.log);

  // Set config lazy promise
  promise = lazy((resolve) => {
    resolve(
      paths({
        file: state.file || undefined,
        directory: state.directory || undefined
      })
    );
  });
}
