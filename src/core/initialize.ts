import path from 'path';
import options from './options';
import { getSelfPaths } from './paths';
import load from './load';
import { absolute } from '~/utils/file';
import guardian from '~/utils/guardian';
import { ICoreData } from './types';

const cwd = process.cwd();

export default async function initialize(): Promise<ICoreData> {
  // Fail if process is already exiting
  guardian();

  // Get options
  const raw = options.raw();

  const paths = await getSelfPaths({
    cwd: cwd,
    directory: raw.directory || undefined,
    file: raw.file || undefined
  });
  process.chdir(paths.directory);

  // if any options change on load that's no problem, the only
  // path option that can change is cwd, which is dealt with below
  const loaded = await load(paths);

  // options cwd can only be set on scope options (on load())
  paths.directory = raw.cwd
    ? absolute({
        path: raw.cwd,
        // we're setting it relative to the file
        cwd: paths.kpo ? path.parse(paths.kpo).dir : paths.directory
      })
    : paths.directory;
  process.chdir(paths.directory);

  return { paths, loaded };
}
