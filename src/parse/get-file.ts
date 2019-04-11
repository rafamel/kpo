import fs from 'fs';
import path from 'path';
import ensure from '~/utils/ensure';
import pify from 'pify';
import { FILE_NAME } from '~/constants';
import { find, exists } from '~/utils/file';

export interface IGetFile {
  file: string;
  directory: string;
}

/**
 * - if only a `file` is passed, it will return that file path along with its directory.
 * - if both a `file` and a `directory` are passed, it will return those -if valid.
 * - if none are passed, it will act as if `directory` was `cwd` and:
 *  - look for a `kpo.scripts` file in that directory and up and return that file path and its directory.
 *  - look for a `package.json` file in that directory and up and if no `kpo.scripts`, the `package.json` is closer to the directory, and it contains a `kpo.path` key, it will return the `directory` of the `package.json` and the `file` in `kpo.path`.
 * - if only a `directory` is passed it will act as above, but only look for files on exactly that directory.
 */
export default async function getFile(
  opts: Partial<IGetFile>
): Promise<IGetFile> {
  const cwd = process.cwd();

  const directory =
    opts.directory &&
    (path.isAbsolute(opts.directory)
      ? opts.directory
      : path.join(cwd, opts.directory));

  const file =
    opts.file &&
    (path.isAbsolute(opts.file)
      ? opts.file
      : path.join(directory || cwd, opts.file));

  return file
    ? getExplicit(file, directory)
    : getDefault(directory || cwd, Boolean(directory));
}

export async function getExplicit(
  file: string,
  directory?: string
): Promise<IGetFile> {
  const { ext } = path.parse(file);
  const validExt = ['.js', '.json', '.yml', '.yaml'].includes(ext);
  if (!validExt) return Promise.reject(Error(`Extension ${ext} is not valid`));

  // Ensure file exists
  await exists(file);
  return { file, directory: directory || path.parse(file).dir };
}

export async function getDefault(
  directory: string,
  strict: boolean
): Promise<IGetFile> {
  let dir = path.parse(directory).dir;
  let at = await find(
    ['.js', '.json', '.yml', '.yaml'].map((ext) => FILE_NAME + ext),
    directory,
    strict
  );

  // If file found in dir, return
  if (at) {
    dir = path.parse(at).dir;
    if (dir === path.parse(directory).dir) return { file: at, directory: dir };
  }

  // Otherwise, check whether there is a package.json w/ kpo.path
  // closer to directory
  const pkg = await getFromPackage(directory, strict);
  if (pkg && (!at || pkg.directory.length > dir.length)) {
    at = pkg.file;
    dir = pkg.directory;
  }

  if (!at) throw Error(`${FILE_NAME}.{js,json,yml,yaml} could't be found`);
  return { file: at, directory: dir };
}

export async function getFromPackage(
  directory: string,
  strict: boolean
): Promise<IGetFile | null> {
  const at = await find('package.json', directory, strict);
  if (!at) return null;

  let dir = path.parse(at).dir;
  const buffer = await ensure.rejection(() => pify(fs.readFile)(at));
  const pkg = JSON.parse(buffer.toString());

  if (!pkg.kpo || !pkg.kpo.path) return null;

  const file = path.isAbsolute(pkg.kpo.path)
    ? pkg.kpo.path
    : path.join(dir, pkg.kpo.path);

  // Ensure file exists
  await exists(file);
  return { file, directory: dir };
}
