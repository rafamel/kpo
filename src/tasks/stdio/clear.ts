import { Task, Context } from '../../definitions';

/**
 * Clears a context's stdout.
 * @returns Task
 */
export function clear(): Task.Sync {
  return (ctx: Context): void => {
    ctx.stdio[1].write('\x1Bc');
  };
}
