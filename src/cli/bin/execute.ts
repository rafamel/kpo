import process from 'node:process';

import { ensure } from 'errorish';

import type { Callable } from '../../types';
import type { Task } from '../../definitions';
import { stringifyError } from '../../helpers/stringify';
import { create, log } from '../../tasks';
import { run } from '../../utils';

export async function execute(task: Callable<void, Task>): Promise<void> {
  try {
    const exits = await import('exits');
    const controller = new AbortController();
    const promise = run(
      { cancellation: controller.signal },
      create(() => task())
    );

    exits.attach();
    exits.options({
      spawned: { signals: 'none', wait: 'none' },
      resolver(type, arg) {
        return type === 'signal'
          ? exits.resolver('exit', 1)
          : exits.resolver(type, arg);
      }
    });
    exits.add(async () => {
      controller.abort();
      await promise.catch(() => undefined);
    });

    await promise;
  } catch (err) {
    await run(null, log('error', stringifyError(ensure(err))));
    return process.exit(1);
  }
}
