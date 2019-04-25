import path from 'path';
import fs from 'fs-extra';
import yaml from 'js-yaml';
import { rejects } from 'errorish';
import { open } from '~/utils/errors';
import { ILoaded, IPaths } from './types';
import { IOfType } from '~/types';
import options from './options';

export default async function load(paths: IPaths): Promise<ILoaded> {
  return {
    kpo: paths.kpo ? await loadFile(paths.kpo) : null,
    pkg: paths.pkg ? await fs.readJSON(paths.pkg).catch(rejects) : null
  };
}

export async function loadFile(file: string): Promise<IOfType<any>> {
  const { ext } = path.parse(file);

  switch (ext) {
    case '.js':
      return open.throws(() => require(file));
    case '.json':
      return fs
        .readJSON(file)
        .catch(rejects)
        .then(getScripts);
    case '.yml':
    case '.yaml':
      const kpo = yaml.safeLoad(
        await fs
          .readFile(file)
          .then(String)
          .catch(rejects)
      );
      return getScripts(kpo);
    default:
      throw Error(`Extension not valid for ${file}`);
  }
}

export function getScripts(kpo: IOfType<any>): IOfType<any> {
  if (!kpo.scripts) throw Error(`Scripts file didn't contain a scripts key`);

  if (kpo.options) options.setScope(kpo.options);
  return kpo.scripts;
}
