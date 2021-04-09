import { Task } from '../../definitions';
import { isLogLevelActive } from '../../helpers/logging';
import { context } from '../creation/context';

/**
 * Will suppress the context's stdio.
 * Logging levels equal or above debug will
 * maintain the context's stdout and stderr.
 * @returns Task
 */
export function silence(task: Task): Task.Async {
  return context(
    (ctx) => ({
      stdio: isLogLevelActive('debug', ctx)
        ? [null, ctx.stdio[1], ctx.stdio[2]]
        : [null, null, null]
    }),
    task
  );
}
