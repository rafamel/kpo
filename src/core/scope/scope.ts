import logger from '~/utils/logger';
import { IChild } from '../types';

export default function getScope(
  name: string,
  children: IChild[],
  directories: { self: string; root?: string }
): IChild | null {
  // root scope
  if (name === 'root') {
    if (directories.root) {
      return { name: 'root', directory: directories.root };
    } else {
      logger.debug('root scope was not found and was assigned to self');
      return { name: 'root', directory: directories.self };
    }
  }

  // child scopes
  const matches = children
    .filter((child) => child.name.includes(name))
    .map((child) => child.directory);

  if (matches.length) {
    logger.debug(`Scopes found for ${name}: ${matches.join(', ')}`);

    if (matches.length > 1) {
      throw Error(`Found several scopes matching ${name}`);
    }

    return { name, directory: matches[0] };
  }

  logger.debug(`Scope ${name} not found as a child from ${directories.self}`);
  return null;
}
