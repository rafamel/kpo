import path from 'path';
import fs from 'fs-extra';
import logger from '~/utils/logger';
import { exists } from '~/utils/file';
import getChildrenFromGlobs from './from-globs';
import getChildrenFromMap from './from-map';
import { IChild } from '../../types';
import { TChildrenDefinition } from '~/types';

export default async function getChildren(
  directories: { cwd: string; pkg: string },
  definition?: TChildrenDefinition
): Promise<IChild[]> {
  logger.debug('obtaining children');

  if (definition) {
    logger.debug('children found in options');

    if (Array.isArray(definition)) {
      return getChildrenFromGlobs(definition, directories.cwd);
    }
    return getChildrenFromMap(definition, directories.cwd);
  }

  const lerna = (await exists(path.join(directories.pkg, 'lerna.json')))
    ? await fs.readJSON(path.join(directories.pkg, 'lerna.json'))
    : null;

  if (lerna) {
    logger.debug('lerna file found');
    if (lerna.packages) {
      return getChildrenFromGlobs(lerna.packages, directories.pkg);
    }
  }

  logger.debug('no children found');
  return [];
}
