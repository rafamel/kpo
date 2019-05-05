import core from '~/core';
import { attach as _attach, options, resolver } from 'exits';

export default function attach(): void {
  _attach();
  options({
    spawned: {
      signals: 'none',
      wait: 'all',
      sigterm: 0,
      sigkill: 5000
    },
    async resolver(type, arg) {
      const silent = await core.get('silent').catch(() => false);

      if (silent) return resolver('exit', 0);
      return type === 'signal' ? resolver('exit', 1) : resolver(type, arg);
    }
  });
}
