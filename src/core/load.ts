import path from 'path';
import fs from 'fs-extra';
import yaml from 'js-yaml';
import { open } from '~/utils/errors';
import { ILoaded, IPaths } from './types';
import { IOfType, IScopeOptions, IPackageOptions } from '~/types';
import { absolute } from '~/utils/file';

export default async function load(paths: IPaths): Promise<ILoaded> {
  const kpo = paths.kpo ? await loadFile(paths.kpo) : null;
  const pkg: IOfType<any> | null = paths.pkg
    ? await fs.readJSON(paths.pkg)
    : null;

  const options: IScopeOptions = {};

  if (paths.pkg && pkg && pkg.kpo) {
    const pkgOpts: IPackageOptions = pkg.kpo;
    // file was already read when getting paths;
    // it's also not a IScopeOptions field
    delete pkgOpts.file;
    if (pkgOpts.cwd) {
      pkgOpts.cwd = absolute({
        path: pkgOpts.cwd,
        cwd: path.parse(paths.pkg).dir
      });
    }
    Object.assign(options, pkgOpts);
  }

  if (paths.kpo && kpo && kpo.options) {
    if (kpo.options.cwd) {
      kpo.options.cwd = absolute({
        path: kpo.options.cwd,
        cwd: path.parse(paths.kpo).dir
      });
    }
    Object.assign(options, kpo.options);
  }

  return {
    kpo: (kpo && kpo.scripts) || null,
    pkg,
    options
  };
}

export async function loadFile(file: string): Promise<IOfType<any> | null> {
  const { ext } = path.parse(file);

  switch (ext) {
    case '.js':
      return requireLocal(file);
    case '.json':
      return fs.readJSON(file);
    case '.yml':
    case '.yaml':
      return yaml.safeLoad(await fs.readFile(file).then(String));
    default:
      throw Error(`Extension not valid for ${file}`);
  }
}

export async function requireLocal(file: string): Promise<IOfType<any>> {
  let kpo: any;
  try {
    kpo = require(file);
  } catch (err) {
    throw open(err);
  }

  return kpo;
}
