import { Task } from '../../definitions';
import { run } from '../../utils/run';
import { raises } from '../exception/raises';
import { log } from '../stdio/log';
import { Empty } from 'type-core';
import { create } from '../creation/create';
import { series } from '../aggregate/series';

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
  return ms < 0
    ? series(log('debug', 'Timeout disabled:', ms), task)
    : series(
        log('debug', 'Task timeout set at', ms),
        create(async (ctx) => {
          const altTask = alternate || raises('Task timeout');
          if (ms <= 0) return altTask;

          let didTimeout = false;
          let timeout: NodeJS.Timeout | null = null;
          await run(task, {
            ...ctx,
            cancellation: Promise.race([
              new Promise<void>((resolve) => {
                timeout = setTimeout(
                  () => (didTimeout = true) && resolve(),
                  ms
                );
              }),
              ctx.cancellation.finally(() => timeout && clearTimeout(timeout))
            ])
          });

          if (timeout) clearTimeout(timeout);
          if (didTimeout) {
            return series(log('debug', 'Task timeout'), altTask);
          }
        })
      );
}
