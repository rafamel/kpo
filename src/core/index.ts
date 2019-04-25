import _cache from '~/utils/cache';
import options from '~/options';
import { getSelfPaths, getRootPaths } from './paths';
import load from './load';
import setScope from './scope';
import { IPaths, ILoaded } from './types';
import getBin from './bin';
import exec from './exec';
import logger from '~/utils/logger';

export interface ICoreState {
  scopes: string[];
}

export const state: ICoreState = {
  scopes: []
};

const cache = _cache.bind(null, () => options.id);
const core = {
  get state(): ICoreState {
    return state;
  },
  paths: cache(async function(): Promise<IPaths> {
    return getSelfPaths({
      file: options.get('file') || undefined,
      directory: options.get('directory') || undefined
    });
  }),
  root: cache(async function(): Promise<IPaths | null> {
    const paths = await core.paths();
    return getRootPaths({
      self: paths.directory,
      root: options.get('root')
    });
  }),
  load: cache(async function(): Promise<ILoaded> {
    return load(await core.paths());
  }),
  bin: cache(async function(): Promise<string[]> {
    const paths = await core.paths();
    const root = await core.root();
    return root
      ? getBin(paths.directory, root.directory)
      : getBin(paths.directory);
  }),
  async exec(command: string): Promise<void> {
    const paths = await core.paths();
    const bin = await core.bin();
    const env = options.get('env');
    return exec(command, paths.directory, bin, env);
  },
  async setScope(names: string[]): Promise<void> {
    const paths = await core.paths();
    const root = await core.root();

    const { next, scope } = await setScope(
      names,
      { self: paths.directory, root: root ? root.directory : undefined },
      options.get('children')
    );
    if (scope) {
      logger.debug(`${scope.name} scope set`);
      // keep track of scope branches
      state.scopes = state.scopes.concat(scope.name);
      // set current directory as the the one of the scope
      options.setBase({ file: null, directory: scope.directory });
      // reset options
      options.setScope();
    }
    // Continue recursively
    if (next.length) return core.setScope(next);
  }
};

export default core;
