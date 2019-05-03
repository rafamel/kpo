import path from 'path';
import fs from 'fs-extra';
import yaml from 'js-yaml';
import { rejects } from 'errorish';
import errors from '~/utils/errors';
import { ILoaded, IPaths } from './types';
import { IOfType, IPackageOptions } from '~/types';
import options from './options';
import { absolute } from '~/utils/file';
import * as _public from '../public';

export default async function load(paths: IPaths): Promise<ILoaded> {
  // pkg must be loaded first to set options first, if present at key `kpo`
  const pkg = paths.pkg
    ? await fs
        .readJSON(paths.pkg)
        .then((pkg) => processPkg(paths.pkg as string, pkg))
        .catch(rejects)
    : null;

  const kpo = paths.kpo ? await loadFile(paths.kpo) : null;

  return { kpo, pkg };
}

export async function loadFile(file: string): Promise<IOfType<any> | null> {
  const { ext } = path.parse(file);

  switch (ext) {
    case '.js':
      return requireLocal(file);
    case '.json':
      return fs
        .readJSON(file)
        .then(processStatic)
        .catch(rejects);
    case '.yml':
    case '.yaml':
      const kpo = yaml.safeLoad(
        await fs
          .readFile(file)
          .then(String)
          .catch(rejects)
      );
      return processStatic(kpo);
    default:
      throw Error(`Extension not valid for ${file}`);
  }
}

export function processStatic(kpo: IOfType<any>): IOfType<any> | null {
  if (kpo.options) options.setScope(kpo.options);

  return kpo.scripts || null;
}

export function processPkg(file: string, pkg: IOfType<any>): IOfType<any> {
  if (!pkg || !pkg.kpo) return pkg;

  const opts: IPackageOptions = Object.assign({}, pkg.kpo);
  // file was already read when getting paths;
  // it's also not a IScopeOptions field
  delete opts.file;
  if (opts.cwd) {
    opts.cwd = absolute({ path: opts.cwd, cwd: path.parse(file).dir });
  }

  options.setScope(opts);
  return pkg;
}

export async function requireLocal(file: string): Promise<IOfType<any>> {
  // Ensure local kpo has equal state
  let kpoPath: string | null = null;
  try {
    kpoPath = require.resolve('kpo', { paths: [file] });
  } catch (_) {}
  if (kpoPath) {
    const local = errors.open.throws(() => require(kpoPath as string));
    // Overwrite error constructors and helpers
    if (local && local.errors) Object.assign(local.errors, errors);
  }

  const scripts = errors.open.throws(() => require(file));
  return typeof scripts === 'function' ? scripts(_public) : scripts;
}
