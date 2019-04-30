import path from 'path';
import { IPaths } from '../types';
import getPaths from './paths';
import { WrappedError } from '~/utils/errors';
import { absolute } from '~/utils/file';

/**
 * - `file` determines the path for the `kpo.scripts` file; if not passed, it will be resolved from `directory`.
 * - `directory` determines the path to look for the `package.json` and `kpo.scripts` files; if passed, files will be expected to be exactly in that directory, otherwise `directory` will be `cwd` and the search will **recurse up** until the root folder is reached. If a `package.json` is found closer to `directory` than any `kpo.scripts` containing a `kpo.path` key, that path for a `kpo.scripts` file will take precedence.
 */
export async function getSelfPaths(opts: {
  file?: string;
  directory?: string;
}): Promise<IPaths> {
  return getPaths(opts, Boolean(opts.directory));
}

/**
 * Will recurse up when `directories.root` is undefined; otherwise it will expect the project directory to be exactly `directories.root`.
 */
export async function getRootPaths(directories: {
  cwd: string;
  root?: string | null;
}): Promise<IPaths | null> {
  const { cwd, root } = directories;
  if (root === null) return null;

  const directory = root
    ? absolute({ path: root, cwd })
    : path.join(cwd, '../');

  try {
    return await getPaths({ directory }, Boolean(root));
  } catch (err) {
    if (!root) return null;
    throw new WrappedError(
      `root scope couldn't be retrieved: ${root}`,
      null,
      err
    );
  }
}
