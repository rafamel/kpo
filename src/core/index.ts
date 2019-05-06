import path from 'path';
import _cache from '~/utils/cache';
import options from './options';
import { getSelfPaths, getRootPaths } from './paths';
import load from './load';
import { setScope, getChildren } from './scope';
import { getTask, getAllTasks } from './tasks';
import { IPaths, ILoaded, ITask, ITasks, IChild } from './types';
import getBin from './bin';
import run from './run';
import logger from '~/utils/logger';
import exec from '~/utils/exec';
import { TCoreOptions, IExecOptions, TScript } from '~/types';
import { absolute } from '~/utils/file';
import wrapCore from './wrap';
import guardian from '~/utils/guardian';
import { globals } from '~/globals';

export interface ICoreState {
  scopes: string[];
  cwd: string;
  paths: IPaths;
}

/* Shared between instances: changes might imply a major version release */
export const state: ICoreState = globals('core', {
  scopes: [],
  cwd: process.cwd(),
  paths: {
    directory: process.cwd(),
    kpo: null,
    pkg: null
  }
}).get();

let loaded: ILoaded = { kpo: null, pkg: null };
const cache = <T>(fn: () => T): (() => T) => _cache(() => options.id, fn);

const core = wrapCore(
  // These will run in order before any core function call
  [
    async () => guardian(),
    cache(async function(): Promise<void> {
      const raw = options.raw();

      state.paths = await getSelfPaths({
        cwd: state.cwd,
        directory: raw.directory || undefined,
        file: raw.file || undefined
      });
      process.chdir(state.paths.directory);

      // if any options change on load that's no problem, the only
      // path option that can change is cwd, which is dealt with below
      loaded = await load(state.paths);

      // options cwd can only be set on scope options (on load())
      state.paths.directory = raw.cwd
        ? absolute({
            path: raw.cwd,
            // we're setting it relative to the file
            cwd: state.paths.kpo
              ? path.parse(state.paths.kpo).dir
              : state.paths.directory
          })
        : state.paths.directory;
      process.chdir(state.paths.directory);
    })
  ],
  // Core functions
  {
    async get<T extends keyof TCoreOptions>(key: T): Promise<TCoreOptions[T]> {
      return options.raw()[key];
    },
    async scopes(): Promise<string[]> {
      return state.scopes;
    },
    async paths(): Promise<IPaths> {
      return state.paths;
    },
    async load(): Promise<ILoaded> {
      return loaded;
    },
    root: cache(async function(): Promise<IPaths | null> {
      return getRootPaths({
        cwd: state.paths.directory,
        root: await core.get('root')
      });
    }),
    children: cache(async function(): Promise<IChild[]> {
      const children = await core.get('children');

      return getChildren(
        {
          cwd: state.paths.directory,
          pkg: state.paths.pkg
            ? path.parse(state.paths.pkg).dir
            : state.paths.directory
        },
        children
      );
    }),
    bin: cache(async function(): Promise<string[]> {
      const root = await core.root();
      return root
        ? getBin(state.paths.directory, root.directory)
        : getBin(state.paths.directory);
    }),
    tasks: cache(async function(): Promise<ITasks> {
      return getAllTasks(loaded.kpo || undefined, loaded.pkg || undefined);
    }),
    async task(path: string): Promise<ITask> {
      return getTask(path, loaded.kpo || undefined, loaded.pkg || undefined);
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
      });
    },
    async exec(
      command: string,
      args: string[],
      fork: boolean,
      opts: IExecOptions = {}
    ): Promise<void> {
      const cwd = opts.cwd
        ? absolute({ path: opts.cwd, cwd: state.paths.directory })
        : state.paths.directory;
      const env = opts.env
        ? Object.assign({}, await core.get('env'), opts.env)
        : await core.get('env');
      const bin = cwd ? await getBin(cwd) : await core.bin();

      const { promise } = exec(command, args, fork, {
        ...opts,
        cwd,
        env,
        paths: opts.paths ? opts.paths.concat(bin) : bin
      });

      return promise;
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
  }
);

export { core as default, options };
