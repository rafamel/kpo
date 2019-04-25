import fs from 'fs-extra';
import path from 'path';
import { rejects } from 'errorish';
import { FILE_NAME, FILE_EXT } from '~/constants';
import { find, exists } from '~/utils/file';

export interface IGetFiles {
  kpo: string | null;
  pkg: string | null;
}

/**
 * - if `strict` is `false`, it will look recursively in `directory` -if passed, otherwise `cwd`- for both `package.json` and `kpo.scripts` files.
 * - if `strict` is `true`, files will be expected to be in exactly `directory`.
 * - if `file` is provided, that will determine the path for the `kpo.scripts` file, and will make the `directory` to look for the `package.json` its directory, unless otherwise provided.
 */
export default async function getFiles(
  opts: {
    file?: string;
    directory?: string;
  },
  strict: boolean
): Promise<IGetFiles> {
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
    ? getExplicit(file, directory, strict)
    : getDefault(directory || cwd, strict);
}

export async function getExplicit(
  file: string,
  directory: string | undefined,
  strict: boolean
): Promise<IGetFiles> {
  const { ext } = path.parse(file);
  const validExt = FILE_EXT.includes(ext);
  if (!validExt) return Promise.reject(Error(`Extension ${ext} is not valid`));

  // Ensure file exists
  await exists(file, { fail: true });

  const dir = directory || path.parse(file).dir;
  return {
    kpo: file,
    pkg: await getPackage(dir, strict)
  };
}

export async function getDefault(
  directory: string,
  strict: boolean
): Promise<IGetFiles> {
  let dir = path.join(path.parse(directory).dir, path.parse(directory).base);

  let kpo: string | null | undefined = await find(
    FILE_EXT.map((ext) => FILE_NAME + ext),
    directory,
    strict
  );

  // If file found in dir, return
  if (kpo) {
    if (path.parse(kpo).dir === dir) {
      return {
        kpo,
        pkg: await getPackage(dir, strict)
      };
    }
  }

  // Otherwise, check whether there is a package.json w/ kpo.path
  // closer to directory
  const pkg = await getPackage(dir, strict);
  if (pkg && (!kpo || pkg.length > path.parse(kpo).dir.length)) {
    kpo = await getFromPackage(pkg);
  }

  return { kpo: kpo, pkg };
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
