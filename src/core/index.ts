import path from 'path';
import _cache from '~/utils/cache';
import options from './options';
import { getSelfPaths, getRootPaths } from './paths';
import load from './load';
import { setScope, getChildren } from './scope';
import { getTask, getAllTasks } from './tasks';
import { IPaths, ILoaded, ITask, ITasks, IChild } from './types';
import getBin from './bin';
import exec from '~/utils/exec';
import run from './run';
import logger from '~/utils/logger';
import { TCoreOptions, IExecOptions, TScript } from '~/types';
import { rejects } from 'errorish';
import { absolute } from '~/utils/file';
import wrapCore from './wrap';
import { loadPackage } from 'cli-belt';
import ob from '~/utils/object-base';
import inVersionRange from '~/utils/version-range';
import { KPO_ENV_STATE, DEFAULT_LOG_LEVEL } from '~/constants';
import guardian from '~/utils/guardian';

export interface ICoreState {
  version: string | null;
  scopes: string[];
  cwd: string;
  paths: IPaths;
}

export const state: ICoreState = {
  version: null,
  scopes: [],
  cwd: process.cwd(),
  paths: {
    directory: process.cwd(),
    kpo: null,
    pkg: null
  }
};

let loaded: ILoaded = { kpo: null, pkg: null };

function cache<T>(fn: () => T): () => T {
  return _cache(() => options.id, fn);
}

// Core changes might constitute major version changes even if internal,
// as core state is overwritten for different kpo instances below
const core = wrapCore(
  // These will run in order before any core function call
  [
    async () => guardian(),
    async function initialize(): Promise<void> {
      if (state.version) return;

      const pkg = await loadPackage(__dirname, { title: false });
      if (!pkg.version) throw Error(`kpo version couldn't be retrieved`);
      state.version = pkg.version;

      const encoded = process.env[KPO_ENV_STATE];
      if (encoded) {
        const decoded = ob.decode(encoded);
        const inRange = inVersionRange(
          decoded && decoded.core && decoded.core.version,
          pkg.version
        );
        if (!inRange) {
          throw Error(
            `Local kpo version (${pkg.version.trim()})` +
              ` doesn't match executing version (${decoded.core.version.trim()})`
          );
        }

        if (path.relative(state.cwd, decoded.core.cwd)) {
          // if cwd has changed, that's an explicit signal for kpo to run
          // in a new directory, hence we won't recover core state,
          // and only recover log level from options state
          options.setBase({ log: decoded.options.log || DEFAULT_LOG_LEVEL });
        } else {
          // otherwise, we'll recover both core and options state
          Object.assign(state, decoded.core);
          options.setBase(decoded.options);
        }

        process.chdir(state.paths.directory);
      }
    },
    cache(async function(): Promise<void> {
      state.paths = await getSelfPaths({
        cwd: state.cwd,
        directory: options.raw.directory || undefined,
        file: options.raw.file || undefined
      });
      process.chdir(state.paths.directory);

      // if any options change on load that's no problem, the only
      // path option that can change is cwd, which is dealt with below
      loaded = await load(state.paths);

      // options cwd can only be set on scope options (on load())
      state.paths.directory = options.raw.cwd
        ? absolute({
            path: options.raw.cwd,
            // we're setting it relative to the file
            cwd: state.paths.kpo
              ? path.parse(state.paths.kpo).dir
              : state.paths.directory
          })
        : state.paths.directory;
      process.chdir(state.paths.directory);

      process.env[KPO_ENV_STATE] = ob.encode({
        core: state,
        options: options.raw
      });
    })
  ],
  // Core functions
  {
    async get<T extends keyof TCoreOptions>(key: T): Promise<TCoreOptions[T]> {
      return options.raw[key];
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
      }).catch(rejects);
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
