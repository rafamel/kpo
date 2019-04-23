import path from 'path';
import getFile from './get-file';
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
  children: IBasePaths[];
}

/**
 * - if no `file` or `directory` are passed, it will **recurse up** from `cwd` to find both the `package.json` and `kpo.scripts` files. If the `package.json` is found closer to `cwd` or no `kpo.scripts` is found, then its `kpo.path` key will be used -if found- to locate the `kpo.scripts` file.
 * - if only `file` is passed, it will get the `kpo.scripts` on that location, and **recurse up** to find a `package.json`.
 * - if a `file` and a `directory` are passed, it will get the `kpo.scripts` on `file` location, and only use a `package.json` if it's found in `directory`.
 * - if only a `directory` is passed, it will try to find both the `kpo.script` and `package.json` files on `directory`; if no `kpo.scripts` is found exactly on directory, it will fall back to the `kpo.path` in `package.json` -if found.
 */
export default async function paths(opts: IPathsOpts): Promise<IPaths> {
  // It will be strict if directory exists (it's passed on cli),
  // otherwise it will recurse up w/ strict = false.
  const base = await trunk(opts, Boolean(opts.directory));
  await load(base);

  // has to to called after load to wait for scope options to modify state
  const root = await trunk(
    { directory: state.get('root') || path.join(base.directory, '../') },
    false
  ).catch(async (err) => {
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
    children: []
  };
}

export async function trunk(
  opts: IPathsOpts,
  strict: boolean
): Promise<IBasePaths> {
  const { kpo, pkg } = await getFile(opts, strict);
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
