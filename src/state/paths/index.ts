import path from 'path';
import getFile from './get-file';
import { IOfType } from '~/types';
import logger from '~/utils/logger';
import { wrap } from '~/utils/errors';
import load from '../load';
import state from '../index';
import up from 'find-up';

export interface IPathsOpts {
  file?: string;
  directory?: string;
}

export interface IBasePaths {
  kpo: string | null;
  pkg: string | null;
  bin: string[];
  directory: string;
}

export interface IPaths extends IBasePaths {
  root: IBasePaths | null;
  children: IOfType<IBasePaths>;
}

export default async function paths(opts: IPathsOpts): Promise<IPaths> {
  const base = await trunk(opts);
  await load(base);

  // has to to called after load to wait for scope options to modify state
  const root = await trunk({
    directory: state.get('root') || path.join(base.directory, '../')
  }).catch(async (err) => {
    return state.get('root')
      ? wrap.rejects(err, {
          message: `root scope couldn't be retrieved: ${state.get('root')}`
        })
      : null;
  });

  return {
    ...base,
    // add also root bin path
    bin: [base.bin[0]]
      .concat(root ? root.bin[0] : [])
      .concat(base.bin.slice(1))
      .concat(root ? root.bin.slice(1) : [])
      .filter((x, i, arr) => x && arr.indexOf(x) === i),
    root,
    children: {}
  };
}

export async function trunk(opts: IPathsOpts): Promise<IBasePaths> {
  const { kpo, pkg } = await getFile(opts);
  let dir = path.parse(pkg || kpo || process.cwd()).dir;

  if (kpo) logger.debug('kpo configuration file found at: ' + kpo);
  if (pkg) logger.debug('package.json found at: ' + pkg);
  if (!kpo && !pkg) {
    throw Error(`No file or package.json was found in directory`);
  }

  return {
    kpo: kpo,
    pkg: pkg,
    directory: dir,
    bin: await getBin(dir)
  };
}

export async function getBin(dir: string): Promise<string[]> {
  const bin = await up('node_modules/.bin', { cwd: dir });
  return bin ? [bin].concat(await getBin(path.join(dir, '../'))) : [];
}
