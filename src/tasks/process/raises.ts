import { Task, Context } from '../../definitions';
import { UnaryFn } from 'type-core';

export function raises(
  error: Error | string | UnaryFn<Context, Error | string>
): Task.Sync {
  return (ctx: Context): void => {
    const err = typeof error === 'function' ? error(ctx) : error;
    throw typeof err === 'string' ? Error(err) : err;
  };
}
