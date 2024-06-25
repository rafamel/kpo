import process from 'node:process';

import type { NullaryFn } from 'type-core';
import { ensure } from 'errorish';

import { stringifyError } from '../../helpers/stringify';
import type { Task } from '../../definitions';
import { create, log } from '../../tasks';
import { run } from '../../utils';

export async function execute(task: NullaryFn<Task>): Promise<void> {
  try {
    const cbs: NullaryFn[] = [];
    const cancellation = new Promise<void>((resolve) => cbs.push(resolve));

    const exits = await import('exits');
    const promise = run({ cancellation }, create(task));

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
      cbs.map((cb) => cb());
      await Promise.all([cancellation, promise]).catch(() => undefined);
    });

    await promise;
  } catch (err) {
    await run(null, log('error', stringifyError(ensure(err))));
    return process.exit(1);
  }
}
