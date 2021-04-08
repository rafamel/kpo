import { Task, Context } from '../../definitions';

/**
 * Supresses the task output
 * and
 * @returns Task
 */
export function clear(): Task.Sync {
  return (ctx: Context): void => {
    if (ctx.stdio[1]) ctx.stdio[1].write('\x1Bc');
  };
}
