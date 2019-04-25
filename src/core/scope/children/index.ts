import path from 'path';
import fs from 'fs-extra';
import logger from '~/utils/logger';
import { exists } from '~/utils/file';
import { rejects } from 'errorish';
import getChildrenFromGlobs from './from-globs';
import getChildrenFromMap from './from-map';
import { IChild } from '../../types';
import { TChildrenDefinition } from '~/types';

export default async function getChildren(
  directory: string,
  definition?: TChildrenDefinition
): Promise<IChild[]> {
  logger.debug('obtaining children');

  if (definition) {
    logger.debug('children found in options');

    if (Array.isArray(definition)) {
      return getChildrenFromGlobs(definition, directory);
    }
    return getChildrenFromMap(definition, directory);
  }

  const lerna = (await exists(path.join(directory, 'lerna.json')))
    ? await fs.readJSON(path.join(directory, 'lerna.json')).catch(rejects)
    : null;

  if (lerna) {
    logger.debug('lerna file found');
    if (lerna.packages) {
      return getChildrenFromGlobs(lerna.packages, directory);
    }
  }

  logger.debug('no children found');
  return [];
}
