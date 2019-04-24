import fs from 'fs-extra';
import { IOfType } from '~/types';
import { rejects } from 'errorish';
import { IBasePaths, ILoaded } from '../types';
import hash from 'object-hash';
import readFile from './read-file';

const cache: IOfType<ILoaded> = {};
export default async function load(paths: IBasePaths): Promise<ILoaded> {
  const key = hash(paths);
  if (!cache.hasOwnProperty(key)) {
    cache[key] = {
      kpo: paths.kpo ? await readFile(paths.kpo) : null,
      pkg: paths.pkg ? await fs.readJSON(paths.pkg).catch(rejects) : null
    };
  }

  return cache[key];
}
