import state from './index';
import logger from '~/utils/logger';
import { IScopeDefinition } from './types';

export default async function scope(
  scope: string
): Promise<IScopeDefinition | null> {
  const paths = await state.paths();
  if (scope === 'root') {
    if (paths.root) {
      return { name: 'root', directory: paths.root.directory };
    } else {
      logger.debug('root scope was not found and was assigned to self');
      return null;
    }
  }

  throw Error(`Scope ${scope} was not found`);
}
