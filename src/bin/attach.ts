import { attach as _attach, options, resolver, add } from 'exits';
import terminate from '~/utils/terminate-children';
import logger from '~/utils/logger';
import { wait, status } from 'promist';

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
    const term = status(terminate(process.pid, 'SIGTERM', 150));
    await Promise.race([term, wait(3000)]);
    if (term.status !== 'pending') return;

    const kill = status(terminate(process.pid, 'SIGKILL', 150));
    await Promise.race([kill, wait(2000)]);
    if (kill.status !== 'pending') return;

    logger.debug(
      'Children processes have timed out without terminating. Exiting main process.'
    );
  });
}
