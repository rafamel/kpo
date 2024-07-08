import type { Task } from '../../definitions';
import { run } from '../../utils/run';
import { onCancel } from '../../utils/cancellation';
import { log } from '../stdio/log';
import { raises } from '../exception/raises';
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
  alternate?: Task | null
): Task.Async {
  return ms < 0
    ? series(log('debug', 'Timeout disabled:', ms), task)
    : series(
        log('debug', 'Task timeout set at', ms, 'milliseconds'),
        create(async (ctx) => {
          const altTask = alternate || raises('Task timeout');
          if (ms <= 0) return altTask;

          let didTimeout = false;
          const controller = new AbortController();
          const timeout = setTimeout(() => {
            didTimeout = true;
            controller.abort();
          }, ms);
          const cleanup = onCancel(ctx, () => {
            clearTimeout(timeout);
            controller.abort();
          });

          await run({ ...ctx, cancellation: controller.signal }, task).finally(
            () => {
              cleanup();
              clearTimeout(timeout);
            }
          );

          if (didTimeout) {
            return series(log('debug', 'Task timeout'), altTask);
          }
        })
      );
}
