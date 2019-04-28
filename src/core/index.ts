import path from 'path';
import _cache from '~/utils/cache';
import options, { raw } from './options';
import { getSelfPaths, getRootPaths } from './paths';
import load from './load';
import { setScope, getChildren } from './scope';
import { getTask, getAllTasks } from './tasks';
import { IPaths, ILoaded, ITask, ITasks, IChild } from './types';
import getBin from './bin';
import exec from './exec';
import run from './run';
import logger from '~/utils/logger';
import { TCoreOptions, IExecOptions, TScript } from '~/types';
import { rejects } from 'errorish';

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
  load: cache(async function(): Promise<ILoaded> {
    return load(await core.paths());
  }),
  cwd: cache(async function(): Promise<string> {
    const cwd = await core.get('cwd');
    const paths = await core.paths();
    if (!cwd) return paths.directory;

    // as cwd is a IScopeOptions property -it can't be set on cli-
    // if it is set and it's not absolute, it must be relative
    // to a kpo scripts file -if on package.json it was already set as absolute
    if (!path.isAbsolute(cwd)) {
      const dir = paths.kpo ? path.parse(paths.kpo).dir : paths.directory;
      return path.join(dir, cwd);
    }

    return cwd;
  }),
  root: cache(async function(): Promise<IPaths | null> {
    const cwd = await core.cwd();

    return getRootPaths({
      cwd,
      root: await core.get('root')
    });
  }),
  children: cache(async function(): Promise<IChild[]> {
    const paths = await core.paths();
    const cwd = await core.cwd();
    const children = await core.get('children');

    return getChildren(
      { cwd, pkg: paths.pkg ? path.parse(paths.pkg).dir : cwd },
      children
    );
  }),
  bin: cache(async function(): Promise<string[]> {
    const cwd = await core.cwd();
    const root = await core.root();
    return root ? getBin(cwd, root.directory) : getBin(cwd);
  }),
  tasks: cache(async function(): Promise<ITasks> {
    const { kpo, pkg } = await core.load();
    return getAllTasks(kpo || undefined, pkg || undefined);
  }),
  async task(path: string): Promise<ITask> {
    const { kpo, pkg } = await core.load();
    return getTask(path, kpo || undefined, pkg || undefined);
  },
  async run(
    script: TScript,
    args: string[],
    opts?: IExecOptions
  ): Promise<void> {
    return run(script, async (item) => {
      return typeof item === 'string'
        ? core.exec(item, args, false, opts)
        : item(args);
    }).catch(rejects);
  },
  async exec(
    command: string,
    args: string[],
    fork: boolean,
    opts: IExecOptions = {}
  ): Promise<void> {
    const cwd = opts.cwd
      ? path.isAbsolute(opts.cwd)
        ? opts.cwd
        : path.join(await core.cwd(), opts.cwd)
      : await core.cwd();
    const bin = opts.cwd ? await getBin(cwd) : await core.bin();
    const env = opts.env
      ? Object.assign({}, await core.get('env'), opts.env)
      : await core.get('env');
    return exec(command, args, fork, cwd, bin, env);
  },
  async setScope(names: string[]): Promise<void> {
    const root = await core.root();

    const { next, scope } = await setScope(
      names,
      { root: root ? root.directory : undefined },
      await core.children()
    );
    if (scope) {
      logger.debug(`${scope.name} scope set`);
      // keep track of scope branches
      state.scopes = state.scopes.concat(scope.name);
      // set current directory as the the one of the scope
      options.setCli({ file: null, directory: scope.directory });
      // reset options
      options.resetScope();
    }
    // Continue recursively
    if (next.length) return core.setScope(next);
  }
};

export { core as default, options };
