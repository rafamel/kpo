import { Task, Context } from '../../definitions';
import { UnaryFn } from 'type-core';

export function raises(error: Error | UnaryFn<Context, Error>): Task.Sync {
  return (ctx: Context): void => {
    throw typeof error === 'function' ? error(ctx) : error;
  };
}
