import type { Task } from '../../definitions';
import { run } from '../../utils/run';
import { isCancelled } from '../../utils/is-cancelled';
import { series } from '../aggregate/series';
import { log } from '../stdio/log';

/**
 * Run `task` for `times` repetitions,
 * or indefinitely otherwise.
 * @returns Task
 */
export function repeat(times: number | null, task: Task): Task.Async {
  return series(
    log('debug', 'Task repetition set at', times, 'times'),
    async (ctx) => {
      let i = 0;
      const isDone = (): boolean => times !== null && times >= 0 && i >= times;

      while (!isDone()) {
        i++;
        if (await isCancelled(ctx)) break;
        await run(ctx, series(log('debug', 'Repeat task:', i), task));
      }
    }
  );
}
