import { IPathsOpts, IBasePaths } from '../../types';
import getPaths from './paths';

/**
 * - `file` determines the path for the `kpo.scripts` file; if not passed, it will be resolved from `directory`.
 * - `directory` determines the path to look for the `package.json` and `kpo.scripts` files; if passed, files will be expected to be exactly in that directory, otherwise `directory` will be `cwd` and the search will **recurse up** until the root folder is reached. If a `package.json` is found closer to `directory` than any `kpo.scripts` containing a `kpo.path` key, that path for a `kpo.scripts` file will take precedence.
 */
export async function getSelfPaths(opts: IPathsOpts): Promise<IBasePaths> {
  return getPaths(opts, Boolean(opts.directory));
}

/**
 * Will always recurse up
 */
export async function getRootPaths(directory: string): Promise<IBasePaths> {
  return getPaths({ directory }, false);
}
