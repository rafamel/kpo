import path from 'path';
import { wrap } from '~/utils/errors';
import load from '../load';
import state from '../index';
import { IPathsOpts, IPaths } from '../types';
import { getSelfPaths, getRootPaths } from './retrieve';

export default async function paths(opts: IPathsOpts): Promise<IPaths> {
  // It will be strict if directory exists (it's passed on cli),
  // otherwise it will recurse up w/ strict = false.
  const self = await getSelfPaths(opts);
  await load(self);

  // has to to called after load to wait for scope options to modify state
  const rootDir = state.get('root');
  const root = await getRootPaths(
    rootDir || path.join(self.directory, '../')
  ).catch(async (err) => {
    // don't fail if root directory wasn't explicitly passed via options,
    // just set as null
    if (!rootDir) return null;

    return wrap.rejects(err, {
      message: `root scope couldn't be retrieved: ${state.get('root')}`
    });
  });

  return {
    ...self,
    // add also root bin path
    bin: [self.bin[0]]
      .concat(root ? root.bin[0] : [])
      .concat(self.bin.slice(1))
      .concat(root ? root.bin.slice(1) : [])
      .filter((x, i, arr) => x && arr.indexOf(x) === i),
    root,
    children: []
  };
}
