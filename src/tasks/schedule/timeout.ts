import { Task, Context } from '../../definitions';
import { isCancelled } from '../../utils/is-cancelled';
import { run } from '../../utils/run';
import { raises } from '../exception/raises';
import { log } from '../stdio/log';
import { Empty } from 'type-core';
import { into } from 'pipettes';

/**
 * Timeout for a `task`, in milliseconds.
 * Will error on timeout unless an `alternate` task is provided.
 * @returns Task
 */
export function timeout(
  ms: number,
  task: Task,
  alternate: Task | Empty
): Task.Async {
  return async (ctx: Context): Promise<void> => {
    if (ms < 0) {
      into(ctx, log('debug', 'Timeout disabled:', ms));
      return run(task, ctx);
    }

    const params = {
      ms: Math.max(ms, 0),
      alternate: alternate || raises('Task timeout')
    };

    into(ctx, log('debug', 'Task timeout set at', params.ms));

    if (params.ms <= 0) return run(params.alternate, ctx);
    let didTimeout = false;
    let timeout: NodeJS.Timeout | null = null;
    await run(task, {
      ...ctx,
      cancellation: Promise.race([
        new Promise<void>((resolve) => {
          timeout = setTimeout(() => {
            into(ctx, log('debug', 'Task timeout'));
            didTimeout = true;
            resolve();
          }, params.ms);
        }),
        ctx.cancellation.finally(() => timeout && clearTimeout(timeout))
      ])
    });

    if (timeout) clearTimeout(timeout);
    if (await isCancelled(ctx)) return;
    if (didTimeout) return run(params.alternate, ctx);
  };
}
