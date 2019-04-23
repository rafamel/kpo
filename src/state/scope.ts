import state from './index';
import logger from '~/utils/logger';

export default async function setScope(scope: string): Promise<string | null> {
  if (scope === 'self') return null;

  const paths = await state.paths();
  if (scope === 'root') {
    if (paths.root) {
      return set('root', paths.root.directory);
    } else {
      logger.debug('root scope was not found and was assigned to self');
      return null;
    }
  }

  throw Error(`Scope ${scope} was not found`);
}

export function set(name: string, path: string): string {
  state.setBase({ file: null, directory: path });
  return name;
}
