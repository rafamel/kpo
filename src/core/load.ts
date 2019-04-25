import path from 'path';
import fs from 'fs-extra';
import yaml from 'js-yaml';
import { rejects } from 'errorish';
import { open } from '~/utils/errors';
import { ILoaded, IPaths } from './types';
import { IScripts } from '~/types';

export default async function load(paths: IPaths): Promise<ILoaded> {
  return {
    kpo: paths.kpo ? await loadFile(paths.kpo) : null,
    pkg: paths.pkg ? await fs.readJSON(paths.pkg).catch(rejects) : null
  };
}

export async function loadFile(file: string): Promise<IScripts> {
  const { ext } = path.parse(file);

  switch (ext) {
    case '.js':
      return open.throws(() => require(file));
    case '.json':
      return fs.readJSON(file).catch(rejects);
    case '.yml':
    case '.yaml':
      return yaml.safeLoad(
        await fs
          .readFile(file)
          .then(String)
          .catch(rejects)
      );
    default:
      throw Error(`Extension not valid`);
  }
}
