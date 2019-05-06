import path from 'path';
import options from './options';
import { getSelfPaths, getRootPaths } from './paths';
import load from './load';
import { absolute } from '~/utils/file';
import guardian from '~/utils/guardian';
import { ICoreData } from './types';
import getBinPaths from '~/utils/paths';
import manager from '~/utils/env-manager';

const cwd = process.cwd();

export default async function initialize(): Promise<ICoreData> {
  // Fail if main process is already exiting
  guardian();

  // Restore environment variables
  manager.restore();

  const paths = await getSelfPaths({
    cwd: cwd,
    directory: options.raw().directory || undefined,
    file: options.raw().file || undefined
  });
  process.chdir(paths.directory);

  // if any options change on load that's no problem, the only
  // path option that can change is cwd, which is dealt with below
  const loaded = await load(paths);
  // At this point options have been loaded: it's safe to save options on var
  const raw = options.raw();

  // options cwd can only be set on scope options (on load())
  paths.directory = raw.cwd
    ? absolute({
        path: raw.cwd,
        // we're setting it relative to the file
        cwd: paths.kpo ? path.parse(paths.kpo).dir : paths.directory
      })
    : paths.directory;
  process.chdir(paths.directory);

  const root = await getRootPaths({
    cwd: paths.directory,
    root: options.raw().root
  });

  const bin = root
    ? await getBinPaths(paths.directory, root.directory)
    : await getBinPaths(paths.directory);

  // At this point options have been loaded -at load()- and we have
  // paths; we assign them to our current environment variables
  if (raw.env) manager.assign(raw.env);
  if (bin.length) manager.addPaths(bin);

  return { paths, loaded, root, bin };
}
