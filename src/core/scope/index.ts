import logger from '~/utils/logger';
import getChildren from './children';
import { IScopeDefinition } from '../types';
import { TChildrenDefinition } from '~/types';

export default async function scope(
  scope: string,
  directories: { self: string; root?: string },
  definitions?: TChildrenDefinition
): Promise<IScopeDefinition | null> {
  // root scope
  if (scope === 'root') {
    if (directories.root) {
      return { names: ['root'], directory: directories.root };
    } else {
      logger.debug('root scope was not found and was assigned to self');
      return null;
    }
  }

  // child scopes
  const children = await getChildren(directories.self, definitions);
  const matches = children
    .filter((child) => child.matcher(scope))
    .map((child) => child.directory);

  if (matches.length) {
    logger.debug(`scopes found for ${scope}:\n${matches.join('\n')}`);

    if (matches.length > 1) {
      throw Error(`Several scopes matched name "${scope}"`);
    }

    return { names: [scope], directory: matches[0] };
  }

  throw Error(`Scope ${scope} was not found`);
}
