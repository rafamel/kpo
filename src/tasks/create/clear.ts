import { Task, Context } from '../../definitions';

export function clear(): Task.Sync {
  return (ctx: Context): void => {
    ctx.stdio[1].write('\x1Bc');
  };
}
