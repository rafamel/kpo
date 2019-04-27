import logger from '~/utils/logger';
import { IScope, IChild } from '../types';

export default async function setScope(
  scopes: string[],
  directories: { self: string; root?: string },
  children: IChild[]
): Promise<{ next: string[]; scope?: IScope }> {
  if (!scopes.length) return { next: [] };

  const name = scopes[0];
  const next = scopes.slice(1);

  // root scope
  if (name === 'root') {
    if (directories.root) {
      return { next, scope: { name: 'root', directory: directories.root } };
    } else {
      logger.debug('root scope was not found and was assigned to self');
      return { next };
    }
  }

  // child scopes
  const matches = children
    .filter((child) => child.matcher(name))
    .map((child) => child.directory);

  if (matches.length) {
    logger.debug(`scopes found for ${name}:\n${matches.join('\n')}`);

    if (matches.length > 1) {
      throw Error(`Several scopes matched name "${name}"`);
    }

    return { next, scope: { name, directory: matches[0] } };
  }

  // it was not found as child, try scaling up to root
  if (directories.root) {
    logger.debug(`scope ${name} not found, scaling to root scope`);
    return {
      next: next.concat(name),
      scope: { name: 'root', directory: directories.root }
    };
  }

  throw Error(`Scope "${name}" was not found`);
}
