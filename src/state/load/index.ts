import path from 'path';
import fs from 'fs-extra';
import getFile from './get-file';
import readFile from './read-file';
import { IOfType, IScripts } from '~/types';
import logger from '~/utils/logger';
import { rejects } from 'errorish';

export interface ILoadOpts {
  file?: string;
  directory?: string;
}

export interface ILoad {
  kpo: IScripts | null;
  pkg: IOfType<any> | null;
  directory: string;
}

export default async function load(opts: ILoadOpts): Promise<ILoad> {
  const { kpo, pkg } = await getFile(opts);

  let dir = path.parse(pkg || kpo || process.cwd()).dir;

  if (kpo) logger.debug('kpo configuration file found at: ' + kpo);
  if (pkg) logger.debug('package.json found at: ' + pkg);
  if (!kpo && !pkg) {
    throw Error(`No file or package.json was found in directory`);
  }

  return {
    kpo: kpo ? await readFile(kpo) : null,
    pkg: pkg ? await fs.readJSON(pkg).catch(rejects) : null,
    directory: dir
  };
}
