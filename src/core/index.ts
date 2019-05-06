import path from 'path';
import _cache from '~/utils/cache';
import options from './options';
import { setScope, getChildren } from './scope';
import { getTask, getAllTasks } from './tasks';
import { IPaths, ILoaded, ITask, ITasks, IChild } from './types';
import run from './run';
import logger from '~/utils/logger';
import exec from '~/utils/exec';
import { TCoreOptions, IExecOptions, TScript } from '~/types';
import wrap from './wrap';
import initialize from './initialize';

let scopes: string[] = [];

const cache = <T>(fn: () => T): (() => T) => _cache(() => options.id, fn);

const core = cache(
  wrap(initialize, (promise) => ({
    async get<T extends keyof TCoreOptions>(key: T): Promise<TCoreOptions[T]> {
      return options.raw()[key];
    },
    async scopes(): Promise<string[]> {
      return scopes;
    },
    async paths(): Promise<IPaths> {
      return promise.then((data) => data.paths);
    },
    async load(): Promise<ILoaded> {
      return promise.then((data) => data.loaded);
    },
    async root(): Promise<IPaths | null> {
      return promise.then((data) => data.root);
    },
    async bin(): Promise<string[]> {
      return promise.then((data) => data.bin);
    },
    children: cache(async function(): Promise<IChild[]> {
      const { paths } = await promise;
      const children = await core().get('children');

      return getChildren(
        {
          cwd: paths.directory,
          pkg: paths.pkg ? path.parse(paths.pkg).dir : paths.directory
        },
        children
      );
    }),
    tasks: cache(async function(): Promise<ITasks> {
      const { loaded } = await promise;
      return getAllTasks(loaded.kpo || undefined, loaded.pkg || undefined);
    }),
    async task(path: string): Promise<ITask> {
      const { loaded } = await promise;
      return getTask(path, loaded.kpo || undefined, loaded.pkg || undefined);
    },
    async run(
      script: TScript,
      args: string[],
      opts?: IExecOptions
    ): Promise<void> {
      return run(script, async (item) => {
        return typeof item === 'string'
          ? exec(item, args, false, opts)
          : item(args);
      });
    },
    async setScope(names: string[]): Promise<void> {
      const root = await core().root();

      const { next, scope } = await setScope(
        names,
        { root: root ? root.directory : undefined },
        await core().children()
      );
      if (scope) {
        logger.debug(`${scope.name} scope set`);
        // keep track of scope branches
        scopes = scopes.concat(scope.name);
        // set current directory as the the one of the scope
        options.setCli({ file: null, directory: scope.directory });
        // reset options
        options.resetScope();
      }
      // Continue recursively
      if (next.length) return core().setScope(next);
    }
  }))
);

export { core as default, options };
