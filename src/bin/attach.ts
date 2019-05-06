import core from '~/core';
import { attach as _attach, options, resolver, add } from 'exits';
import manager from '~/utils/ps-manager';
import logger from '~/utils/logger';
import { wait } from 'promist';

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
    if (manager.isDone()) return;
    logger.debug('Sending SIGTERM to all children processes');

    let start = Date.now();
    manager.kill('SIGTERM');
    while (!manager.isDone() && Date.now() - start < 2500) {
      await Promise.race([manager.promise(), wait(Date.now() - start)]);
    }

    if (manager.isDone()) return;
    logger.debug('Seding SIGKILL to all children processes');

    start = Date.now();
    manager.kill('SIGKILL');
    while (!manager.isDone() && Date.now() - start < 2500) {
      await Promise.race([manager.promise(), wait(Date.now() - start)]);
    }

    if (manager.isDone()) return;
    logger.debug(
      'Children processes have timed out without terminating. Exiting main process.'
    );
  });
}
