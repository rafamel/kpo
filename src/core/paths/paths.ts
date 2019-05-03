import path from 'path';
import getFiles from './files';
import logger from '~/utils/logger';
import { IPaths } from '../types';

export default async function getPaths(
  opts: { cwd: string; file?: string; directory?: string },
  strict: boolean
): Promise<IPaths> {
  const { kpo, pkg } = await getFiles(opts, strict);

  if (kpo) logger.debug('kpo configuration file found at: ' + kpo);
  if (pkg) logger.debug('package.json found at: ' + pkg);
  if (!kpo && !pkg) {
    throw Error(`No file or package.json was found in directory`);
  }

  const dir = path.parse((pkg || kpo) as string).dir;
  return {
    pkg: pkg,
    kpo: kpo,
    directory: dir
  };
}
