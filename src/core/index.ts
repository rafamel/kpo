import path from 'path';
import { getSelfPaths, getRootPaths } from './paths';
import load from './load';
import { lazy as _lazy } from 'promist';
import { ICliOptions, TCoreOptions } from '~/types';
import EnvManager from '~/utils/env-manager';
import merge, { setLogger } from './merge-options';
import { getChildren, getScope } from './scope';
import { getAllTasks, getTask } from './tasks';
import { IPaths, ILoaded, IChild, ITasks, ITask } from './types';
import getBinPaths from '~/utils/paths';
import logger from '~/utils/logger';
import { SilentError } from '~/utils/errors';
import { KPO_LOG_ENV } from '~/constants';

const lazy = <T>(fn: () => Promise<T>): Promise<T> =>
  _lazy((resolve, reject) =>
    fn()
      .then(resolve)
      .catch(reject)
  );

export interface ICore {
  manager: EnvManager;
  paths: Promise<IPaths>;
  loaded: Promise<ILoaded>;
  options: Promise<TCoreOptions>;
  root: Promise<IPaths | null>;
  children: Promise<IChild[]>;
  bin: Promise<string[]>;
  tasks: Promise<ITasks>;
  task(path: string): Promise<ITask>;
  scope(names?: string[]): Promise<ICore>;
  initialize(): Promise<void>;
  restore(): void;
  reset(): void;
}

export default async function contain<T>(
  options: ICliOptions = {},
  fn: (core: ICore) => Promise<T>
): Promise<T> {
  const core = getCore(options);
  let res: T;
  try {
    await core.initialize();
    res = await fn(core);
    core.restore();
  } catch (err) {
    core.restore();
    const opts = await core.options.catch(() => options);
    throw opts.silent ? new SilentError(undefined, err) : err;
  }
  return res;
}

export function getCore(options: ICliOptions, parent?: ICore): ICore {
  const manager = parent ? parent.manager : new EnvManager(process.env);
  const cli = merge(manager, options);
  const restoreLogger = setLogger(manager, cli);
  const cwd = process.cwd();

  const promise = lazy(async () => {
    const paths = await getSelfPaths({
      cwd,
      directory: options.directory || undefined,
      file: options.file || undefined
    });

    const loaded = await load(paths);
    const scope = merge(manager, options, loaded.options);
    setLogger(manager, scope);

    return { paths, loaded, options: scope };
  });

  const root = lazy(() =>
    promise.then((data) =>
      getRootPaths({ cwd: data.paths.directory, root: data.options.root })
    )
  );

  return {
    manager,
    root,
    paths: lazy(() => promise.then((data) => data.paths)),
    loaded: lazy(() => promise.then((data) => data.loaded)),
    options: lazy(() => promise.then((data) => data.options)),
    children: lazy(() =>
      promise.then((data) =>
        getChildren(
          {
            cwd: data.paths.directory,
            pkg: data.paths.pkg
              ? path.parse(data.paths.pkg).dir
              : data.paths.directory
          },
          data.options.children
        )
      )
    ),
    bin: lazy(() =>
      Promise.all([promise, root]).then(([data, root]) =>
        root
          ? getBinPaths(data.paths.directory, root.directory)
          : getBinPaths(data.paths.directory)
      )
    ),
    tasks: lazy(() =>
      promise.then((data) =>
        getAllTasks(data.loaded.kpo || undefined, data.loaded.pkg || undefined)
      )
    ),
    async task(path: string): Promise<ITask> {
      const loaded = await this.loaded;
      return getTask(path, loaded.kpo || undefined, loaded.pkg || undefined);
    },
    async scope(names: string[] = []): Promise<ICore> {
      if (!names.length) return this;
      const name = names[0];

      const paths = await this.paths;
      const root = await this.root;
      const children = await this.children;
      const scope = getScope(name, children, {
        self: paths.directory,
        root: root ? root.directory : undefined
      });

      if (scope) {
        const core = await getCore(
          { ...options, file: null, directory: scope.directory },
          this
        ).scope(names.slice(1));
        await core.initialize();
        return core;
      }

      if (!root) throw Error(`Scope not found: ${name}`);
      return this.scope(['root'].concat(names));
    },
    async initialize(): Promise<void> {
      this.restore();

      const { paths, options: opts } = await promise;
      const bin = await this.bin;
      logger.debug(`Initializing scope with path: ${paths.directory}`);

      // Use cli options to set hard logging level
      if (options.log) manager.set(KPO_LOG_ENV, options.log);

      // Set environmentals
      setLogger(manager, opts);
      process.chdir(paths.directory);
      if (opts.env) manager.assign(opts.env);
      if (bin.length) manager.addPaths(bin);
    },
    restore(): void {
      if (parent) return parent.restore();

      restoreLogger();
      manager.restore();
      process.chdir(cwd);
    },
    async reset(): Promise<void> {
      Object.assign(this, getCore(options, parent));
      await this.initialize();
    }
  };
}
