import type { Task } from '../../definitions';
import { run } from '../../utils/run';
import { isCancelled } from '../../utils/cancellation';
import { series } from '../aggregate/series';
import { log } from '../stdio/log';

/**
 * Run `task` for `times` repetitions,
 * or indefinitely otherwise.
 * @returns Task
 */
export function repeat(times: number, task: Task): Task.Async {
  return series(
    log('debug', 'Task repetition set at', times, 'times'),
    async (ctx) => {
      let i = 0;
      const isDone = (): boolean => times >= 0 && i >= times;

      while (!isDone()) {
        i++;
        if (isCancelled(ctx)) break;
        await run(ctx, series(log('debug', 'Repeat task:', i), task));
      }
    }
  );
}
