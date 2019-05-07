import core from '~/core';
import { attach as _attach, options, resolver, add } from 'exits';
import PSManager from '~/utils/ps-manager';
import logger from '~/utils/logger';
import { wait, status } from 'promist';

export default function attach(): void {
  _attach();
  options({
    async resolver(type, arg) {
      const silent = core()
        .get('silent')
        .catch(() => false);

      if (silent) {
        logger.debug('Silent: exiting with code 0');
        return resolver('exit', 0);
      }
      if (type === 'signal') {
        logger.debug('Received a termination signal: exiting with code 1');
        return resolver('exit', 1);
      }
      logger.debug(`${type} event: `, arg);
      return resolver(type, arg);
    }
  });
  add(async () => {
    const manager = new PSManager(process.pid);
    if (!(await manager.hasChildren())) return;

    const term = status(manager.killAll('SIGTERM', 150));
    await Promise.race([term, wait(3000)]);
    if (term.status !== 'pending') return;

    const kill = status(manager.killAll('SIGKILL', 150));
    await Promise.race([kill, wait(2000)]);
    if (kill.status !== 'pending') return;

    logger.debug(
      'Children processes have timed out without terminating. Exiting main process.'
    );
  });
}
