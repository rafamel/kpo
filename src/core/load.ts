import path from 'path';
import fs from 'fs-extra';
import yaml from 'js-yaml';
import { open } from '~/utils/errors';
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
      return fs.readJSON(file).then(processStatic);
    case '.yml':
    case '.yaml':
      const kpo = yaml.safeLoad(await fs.readFile(file).then(String));
      return processStatic(kpo);
    default:
      throw Error(`Extension not valid for ${file}`);
  }
}

export async function processStatic(
  kpo: IOfType<any>
): Promise<IOfType<any> | null> {
  if (kpo.options) await options.setScope(kpo.options);

  return kpo.scripts || null;
}

export async function processPkg(
  file: string,
  pkg: IOfType<any>
): Promise<IOfType<any>> {
  if (!pkg || !pkg.kpo) return pkg;

  const opts: IPackageOptions = Object.assign({}, pkg.kpo);
  // file was already read when getting paths;
  // it's also not a IScopeOptions field
  delete opts.file;
  if (opts.cwd) {
    opts.cwd = absolute({ path: opts.cwd, cwd: path.parse(file).dir });
  }

  await options.setScope(opts);
  return pkg;
}

export async function requireLocal(file: string): Promise<IOfType<any>> {
  let scripts: any;
  try {
    scripts = require(file);
  } catch (err) {
    throw open(err);
  }

  // TODO remove as fn
  return typeof scripts === 'function' ? scripts(_public) : scripts;
}
