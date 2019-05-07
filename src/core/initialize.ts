import path from 'path';
import options from './options';
import { getSelfPaths, getRootPaths } from './paths';
import load from './load';
import { absolute } from '~/utils/file';
import guardian from '~/utils/guardian';
import { ICoreData } from './types';
import getBinPaths from '~/utils/paths';
import manager from '~/utils/env-manager';
import cache from '~/utils/cache';

const cwd = process.cwd();

export default cache(() => options.id, async function initialize(): Promise<
  ICoreData
> {
  // Fail if main process is already exiting
  guardian();

  // Restore environment variables
  manager.restore();

  const paths = await getSelfPaths({
    cwd: cwd,
    directory: options.get('directory') || undefined,
    file: options.get('file') || undefined
  });
  process.chdir(paths.directory);

  // if any options change on load that's no problem, the only
  // path option that can change is cwd, which is dealt with below
  const loaded = await load(paths);
  // At this point options have been loaded: it's safe to save options on var

  // options cwd can only be set on scope options (on load())
  const _cwd = options.get('cwd');
  paths.directory = _cwd
    ? absolute({
        path: _cwd,
        // we're setting it relative to the file
        cwd: paths.kpo ? path.parse(paths.kpo).dir : paths.directory
      })
    : paths.directory;
  process.chdir(paths.directory);

  const root = await getRootPaths({
    cwd: paths.directory,
    root: options.get('root')
  });

  const bin = root
    ? await getBinPaths(paths.directory, root.directory)
    : await getBinPaths(paths.directory);

  // At this point options have been loaded -at load()- and we have
  // paths; we assign them to our current environment variables
  const _env = options.get('env');
  if (_env) manager.assign(_env);
  if (bin.length) manager.addPaths(bin);

  return { paths, loaded, root, bin };
});
