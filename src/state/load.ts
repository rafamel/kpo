import fs from 'fs-extra';
import { rejects } from 'errorish';
import memoize from '~/utils/memoize';
import { load } from '~/utils/file';
import { ILoaded, IBasePaths } from './types';

export default memoize(async function(paths: IBasePaths): Promise<ILoaded> {
  return {
    kpo: paths.kpo ? await load(paths.kpo) : null,
    pkg: paths.pkg ? await fs.readJSON(paths.pkg).catch(rejects) : null
  };
});
