import fs from 'fs-extra';
import path from 'path';
import { rejects } from 'errorish';
import { FILE_NAME } from '~/constants';
import { find, exists } from '~/utils/file';

export interface IGetFile {
  kpo: string | null;
  pkg: string | null;
}

/**
 * - if no `file` or `directory` are passed, it will **recurse up** from `cwd` to find both the `package.json` and `kpo.scripts` files. If the `package.json` is found closer to `cwd` or no `kpo.scripts` is found, then its `kpo.path` key will be used -if found- to locate the `kpo.scripts` file.
 * - if only `file` is passed, it will get the `kpo.scripts` on that location, and **recurse up** to find a `package.json`.
 * - if a `file` and a `directory` are passed, it will get the `kpo.scripts` on `file` location, and only use a `package.json` if it's found in `directory`.
 * - if only a `directory` is passed, it will try to find both the `kpo.script` and `package.json` files on `directory`; if no `kpo.scripts` is found exactly on directory, it will fall back to the `kpo.path` in `package.json` -if found.
 */
export default async function getFile(opts: {
  file?: string;
  directory?: string;
}): Promise<IGetFile> {
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
  await exists(file, { fail: true });

  const dir = directory || path.parse(file).dir;
  return {
    kpo: file,
    pkg: await getPackage(dir, Boolean(directory))
  };
}

export async function getDefault(
  directory: string,
  strict: boolean
): Promise<IGetFile> {
  let dir = path.parse(directory).dir;
  let at: string | null | undefined = await find(
    ['.js', '.json', '.yml', '.yaml'].map((ext) => FILE_NAME + ext),
    directory,
    strict
  );

  // If file found in dir, return
  if (at) {
    if ((path.parse(at).dir = dir)) {
      return {
        kpo: at,
        pkg: await getPackage(dir, strict)
      };
    }
  }

  // Otherwise, check whether there is a package.json w/ kpo.path
  // closer to directory
  const pkg = await getPackage(dir, strict);
  if (pkg && (!at || pkg.length > path.parse(at).dir.length)) {
    at = await getFromPackage(pkg);
  }

  return { kpo: at, pkg };
}

export async function getFromPackage(
  pkg: string | null
): Promise<string | null> {
  if (!pkg) return null;

  const dir = path.parse(pkg).dir;
  const parsed = await fs.readJSON(pkg).catch(rejects);

  if (!parsed.kpo || !parsed.kpo.path) return null;

  const file = path.isAbsolute(parsed.kpo.path)
    ? parsed.kpo.path
    : path.join(dir, parsed.kpo.path);

  // Ensure file exists
  await exists(file, { fail: true });
  return file;
}

export async function getPackage(
  directory: string,
  strict: boolean
): Promise<string | null> {
  return find('package.json', directory, strict);
}
