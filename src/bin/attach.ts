import { attach as _attach, options, resolver, add } from 'exits';
import terminate from 'terminate-children';
import logger from '~/utils/logger';
import { KPO_EXIT_ENV } from '~/constants';
import EnvManager from '~/utils/env-manager';
import { oneLine } from 'common-tags';

export default function attach(): void {
  _attach();
  options({
    spawned: {
      signals: 'none',
      wait: 'none'
    },
    resolver(type, arg) {
      try {
        if (type === 'signal') {
          logger.debug('Received a termination signal: exiting with code 1');
          return resolver('exit', 1);
        }
        return resolver(type, arg);
      } catch (err) {
        return resolver('exit', 1);
      }
    }
  });
  add(async () => {
    new EnvManager(process.env).set(KPO_EXIT_ENV, 'triggered');

    logger.debug('Sending SIGTERM to all children processes');
    const children = await terminate(process.pid, {
      signal: 'SIGTERM',
      timeout: 3000,
      interval: 150
    }).then((children) => {
      if (!children.length) return children;

      logger.debug('Sending SIGKILL to all children processes');
      return terminate(process.pid, {
        signal: 'SIGKILL',
        timeout: 2000,
        interval: 150
      });
    });

    if (children.length) {
      logger.debug(
        oneLine`Children processes have timed out without terminating.
            Exiting main process.`
      );
    }
  });
}
