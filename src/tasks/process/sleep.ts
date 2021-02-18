import { Task, Context } from '../../definitions';
import { log } from '../stdio/log';
import { into } from 'pipettes';

export function sleep(ms: number): Task.Async {
  return async (ctx: Context): Promise<void> => {
    into(ctx, log('debug', `Sleep for ${ms}ms`));

    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(), ms);
      ctx.cancellation.finally(() => {
        clearTimeout(timeout);
        resolve();
      });
    });
  };
}
