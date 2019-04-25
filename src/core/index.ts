import _cache from '~/utils/cache';
import options, { raw } from './options';
import { getSelfPaths, getRootPaths } from './paths';
import load from './load';
import setScope from './scope';
import { getTask, getAllTasks } from './tasks';
import { IPaths, ILoaded, ITask, ITasks } from './types';
import getBin from './bin';
import exec from './exec';
import logger from '~/utils/logger';
import { TCoreOptions, IOfType } from '~/types';

export interface ICoreState {
  scopes: string[];
}

export const state: ICoreState = {
  scopes: []
};

function cache<T extends Function>(fn: T): T {
  return _cache(() => options.id, fn);
}

const core = {
  get state(): ICoreState {
    return state;
  },
  async get<T extends keyof TCoreOptions>(key: T): Promise<TCoreOptions[T]> {
    // we're ensuring we've loaded user options when
    // any option is requested
    await core.load();
    return raw()[key];
  },
  paths: cache(async function(): Promise<IPaths> {
    const options = raw();
    return getSelfPaths({
      file: options.file || undefined,
      directory: options.directory || undefined
    });
  }),
  root: cache(async function(): Promise<IPaths | null> {
    const paths = await core.paths();

    return getRootPaths({
      self: paths.directory,
      root: await core.get('root')
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
  tasks: cache(async function(): Promise<ITasks> {
    const { kpo, pkg } = await core.load();
    return getAllTasks(kpo || undefined, pkg || undefined);
  }),
  async task(path: string): Promise<ITask> {
    const { kpo, pkg } = await core.load();
    return getTask(path, kpo || undefined, pkg || undefined);
  },
  async exec(
    command: string,
    args: string[],
    opts: { cwd?: string; env?: IOfType<string> } = {}
  ): Promise<void> {
    const cwd = opts.cwd
      ? opts.cwd
      : await core.paths().then((paths) => paths.directory);
    const bin = opts.cwd ? await getBin(opts.cwd) : await core.bin();
    const env = opts.env
      ? Object.assign({}, await core.get('env'), opts.env)
      : await core.get('env');
    return exec(command, args, cwd, bin, env);
  },
  async setScope(names: string[]): Promise<void> {
    const paths = await core.paths();
    const root = await core.root();

    const { next, scope } = await setScope(
      names,
      { self: paths.directory, root: root ? root.directory : undefined },
      await core.get('children')
    );
    if (scope) {
      logger.debug(`${scope.name} scope set`);
      // keep track of scope branches
      state.scopes = state.scopes.concat(scope.name);
      // set current directory as the the one of the scope
      options.setCli({ file: null, directory: scope.directory });
      // reset options
      options.setScope();
    }
    // Continue recursively
    if (next.length) return core.setScope(next);
  }
};

export { core as default, options };
