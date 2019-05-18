import path from 'path';
import { getSelfPaths, getRootPaths } from './paths';
import load from './load';
import { lazy } from 'promist';
import { ICliOptions, TCoreOptions } from '~/types';
import merge from './merge-options';
import { getChildren, getScope } from './scope';
import { getAllTasks, getTask } from './tasks';
import { IPaths, ILoaded, IChild, ITasks, ITask } from './types';
import getBinPaths from '~/utils/paths';
import logger from '~/utils/logger';
import { SilentError } from '~/utils/errors';
import { KPO_LOG_ENV } from '~/constants';
import StateManager from './StateManager';

export interface ICore {
  paths: IPaths;
  loaded: ILoaded;
  options: TCoreOptions;
  tasks: ITasks;
  bin: string[];
  root: IPaths | null;
  children: Promise<IChild[]>;
  task(path: string): ITask;
  initialize(): void;
  restore(): void;
  reset(): Promise<void>;
  scope(names?: string[]): Promise<ICore>;
}

export default async function contain<T>(
  options: ICliOptions = {},
  fn: (core: ICore) => Promise<T>
): Promise<T> {
  const manager = new StateManager();
  try {
    const core = await getCore(manager, options);
    options = core.options;

    const response = await fn(core);
    manager.restore();
    return response;
  } catch (err) {
    manager.restore();
    throw options.silent ? new SilentError(undefined, err) : err;
  }
}

export async function getCore(
  manager: StateManager,
  options: ICliOptions
): Promise<ICore> {
  const cli = merge(manager, options);
  if (cli.log) manager.setLogger(cli.log);

  const paths = await getSelfPaths({
    cwd: process.cwd(),
    directory: options.directory || undefined,
    file: options.file || undefined
  });

  // Load should be called with directory as cwd (for js files)
  manager.setCwd(paths.directory);
  const loaded = await load(paths);
  const scope = {
    ...merge(manager, options, loaded.options),
    cwd: loaded.options.cwd || paths.directory
  };
  manager.setCwd(scope.cwd);

  const root = await getRootPaths({ cwd: scope.cwd, root: scope.root });
  const bin = root
    ? await getBinPaths(scope.cwd, root.directory)
    : await getBinPaths(scope.cwd);
  const tasks = getAllTasks(loaded.kpo || undefined, loaded.pkg || undefined);

  return {
    paths,
    loaded,
    options: scope,
    tasks,
    bin,
    root,
    children: lazy.fn(() => {
      return getChildren(
        {
          cwd: scope.cwd,
          pkg: paths.pkg ? path.parse(paths.pkg).dir : scope.cwd
        },
        scope.children
      );
    }),
    task(path: string): ITask {
      return getTask(path, loaded.kpo || undefined, loaded.pkg || undefined);
    },
    initialize(): void {
      this.restore();

      logger.debug(`Initializing scope with path: ${paths.directory}`);

      // Use cli options to set hard logging level
      if (scope.log) {
        manager.setLogger(scope.log);
        manager.set(KPO_LOG_ENV, scope.log);
      }

      // Set cwd
      manager.setCwd(scope.cwd || paths.directory);

      // Set environmentals
      if (scope.env) manager.assign(scope.env);
      if (bin.length) manager.addPaths(bin);
    },
    restore(): void {
      return manager.restore();
    },
    async reset(): Promise<void> {
      Object.assign(this, await getCore(manager, options));
      this.initialize();
    },
    async scope(names: string[] = []): Promise<ICore> {
      if (!names.length) return this;
      const name = names[0];

      const children = await this.children;
      const scope = getScope(name, children, {
        self: paths.directory,
        root: root ? root.directory : undefined
      });

      if (scope) {
        this.restore();
        const core = await getCore(manager, {
          ...options,
          file: null,
          directory: scope.directory
        }).then((core) => core.scope(names.slice(1)));
        core.initialize();
        return core;
      }

      if (!root) throw Error(`Scope not found: ${name}`);
      return this.scope(['root'].concat(names));
    }
  } as ICore;
}
