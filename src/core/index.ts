import path from 'path';
import cache from '~/utils/cache';
import options from './options';
import { setScope, getChildren } from './scope';
import { getTask, getAllTasks } from './tasks';
import { IPaths, ILoaded, ITask, ITasks, IChild } from './types';
import run from './run';
import logger from '~/utils/logger';
import exec from '~/utils/exec';
import { IExecOptions, TScript } from '~/types';
import initialize from './initialize';

let scopes: string[] = [];
const core = {
  options,
  async scopes(): Promise<string[]> {
    return scopes;
  },
  async paths(): Promise<IPaths> {
    return initialize().then((data) => data.paths);
  },
  async load(): Promise<ILoaded> {
    return initialize().then((data) => data.loaded);
  },
  async root(): Promise<IPaths | null> {
    return initialize().then((data) => data.root);
  },
  async bin(): Promise<string[]> {
    return initialize().then((data) => data.bin);
  },
  children: cache(null, async function(): Promise<IChild[]> {
    const { paths } = await initialize();
    const children = await core.options.get('children');

    return getChildren(
      {
        cwd: paths.directory,
        pkg: paths.pkg ? path.parse(paths.pkg).dir : paths.directory
      },
      children
    );
  }),
  tasks: cache(null, async function(): Promise<ITasks> {
    const { loaded } = await initialize();
    return getAllTasks(loaded.kpo || undefined, loaded.pkg || undefined);
  }),
  async task(path: string): Promise<ITask> {
    const { loaded } = await initialize();
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
    const root = await core.root();

    const { next, scope } = await setScope(
      names,
      { root: root ? root.directory : undefined },
      await core.children()
    );
    if (scope) {
      logger.debug(`${scope.name} scope set`);
      // keep track of scope branches
      scopes = scopes.concat(scope.name);
      // reset scope options
      await core.options.resetScope(false);
      // set current directory as the the one of the scope
      await core.options.setCli({ file: null, directory: scope.directory });
    }
    // Continue recursively
    if (next.length) return core.setScope(next);
  }
};

export default core;
