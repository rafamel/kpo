import { Empty, MaybePromise, UnaryFn } from 'type-core';
import { Context, Task } from '../../definitions';
import { isCancelled } from '../../utils/is-cancelled';
import { run } from '../../utils/run';

/**
 * A task creation pipe of unary functions.
 * All functions will compose the task itself,
 * with a check for cancellation before running each.
 * The first function takes `Context` as an argument.
 * The last function can optionally return a `Task`,
 * which will also be run.
 * @returns Task
 */
export const create = pipe as Create;

function pipe(...fns: Array<UnaryFn<any, MaybePromise<any>>>): Task.Async {
  return async (ctx: Context): Promise<void> => {
    let value: any = ctx;
    for (const fn of fns) {
      if (await isCancelled(ctx)) break;
      value = await fn(value);
    }
    if (value) await run(value, ctx);
  };
}

export interface Create {
  (f1: UnaryFn<Context, MaybePromise<Task | Empty>>): Task.Async;
  <T1>(
    f1: UnaryFn<Context, MaybePromise<T1>>,
    f2: UnaryFn<T1, MaybePromise<Task | Empty>>
  ): Task.Async;
  <T1, T2>(
    f1: UnaryFn<Context, MaybePromise<T1>>,
    f2: UnaryFn<T1, MaybePromise<T2>>,
    f3: UnaryFn<T2, MaybePromise<Task | Empty>>
  ): Task.Async;
  <T1, T2, T3>(
    f1: UnaryFn<Context, MaybePromise<T1>>,
    f2: UnaryFn<T1, MaybePromise<T2>>,
    f3: UnaryFn<T2, MaybePromise<T3>>,
    f4: UnaryFn<T3, MaybePromise<Task | Empty>>
  ): Task.Async;
  <T1, T2, T3, T4>(
    f1: UnaryFn<Context, MaybePromise<T1>>,
    f2: UnaryFn<T1, MaybePromise<T2>>,
    f3: UnaryFn<T2, MaybePromise<T3>>,
    f4: UnaryFn<T3, MaybePromise<T4>>,
    f5: UnaryFn<T4, MaybePromise<Task | Empty>>
  ): Task.Async;
  <T1, T2, T3, T4, T5>(
    f1: UnaryFn<Context, MaybePromise<T1>>,
    f2: UnaryFn<T1, MaybePromise<T2>>,
    f3: UnaryFn<T2, MaybePromise<T3>>,
    f4: UnaryFn<T3, MaybePromise<T4>>,
    f5: UnaryFn<T4, MaybePromise<T5>>,
    f6: UnaryFn<T5, MaybePromise<Task | Empty>>
  ): Task.Async;
  <T1, T2, T3, T4, T5, T6>(
    f1: UnaryFn<Context, MaybePromise<T1>>,
    f2: UnaryFn<T1, MaybePromise<T2>>,
    f3: UnaryFn<T2, MaybePromise<T3>>,
    f4: UnaryFn<T3, MaybePromise<T4>>,
    f5: UnaryFn<T4, MaybePromise<T5>>,
    f6: UnaryFn<T5, MaybePromise<T6>>,
    f7: UnaryFn<T6, MaybePromise<Task | Empty>>
  ): Task.Async;
  <T1, T2, T3, T4, T5, T6, T7>(
    f1: UnaryFn<Context, MaybePromise<T1>>,
    f2: UnaryFn<T1, MaybePromise<T2>>,
    f3: UnaryFn<T2, MaybePromise<T3>>,
    f4: UnaryFn<T3, MaybePromise<T4>>,
    f5: UnaryFn<T4, MaybePromise<T5>>,
    f6: UnaryFn<T5, MaybePromise<T6>>,
    f7: UnaryFn<T6, MaybePromise<T7>>,
    f8: UnaryFn<T7, MaybePromise<Task | Empty>>
  ): Task.Async;
  <T1, T2, T3, T4, T5, T6, T7, T8>(
    f1: UnaryFn<Context, MaybePromise<T1>>,
    f2: UnaryFn<T1, MaybePromise<T2>>,
    f3: UnaryFn<T2, MaybePromise<T3>>,
    f4: UnaryFn<T3, MaybePromise<T4>>,
    f5: UnaryFn<T4, MaybePromise<T5>>,
    f6: UnaryFn<T5, MaybePromise<T6>>,
    f7: UnaryFn<T6, MaybePromise<T7>>,
    f8: UnaryFn<T7, MaybePromise<T8>>,
    f9: UnaryFn<T8, MaybePromise<Task | Empty>>
  ): Task.Async;
  <T1, T2, T3, T4, T5, T6, T7, T8, T9>(
    f1: UnaryFn<Context, MaybePromise<T1>>,
    f2: UnaryFn<T1, MaybePromise<T2>>,
    f3: UnaryFn<T2, MaybePromise<T3>>,
    f4: UnaryFn<T3, MaybePromise<T4>>,
    f5: UnaryFn<T4, MaybePromise<T5>>,
    f6: UnaryFn<T5, MaybePromise<T6>>,
    f7: UnaryFn<T6, MaybePromise<T7>>,
    f8: UnaryFn<T7, MaybePromise<T8>>,
    f9: UnaryFn<T8, MaybePromise<T9>>,
    f10: UnaryFn<T9, MaybePromise<Task | Empty>>
  ): Task.Async;
  <T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
    f1: UnaryFn<Context, MaybePromise<T1>>,
    f2: UnaryFn<T1, MaybePromise<T2>>,
    f3: UnaryFn<T2, MaybePromise<T3>>,
    f4: UnaryFn<T3, MaybePromise<T4>>,
    f5: UnaryFn<T4, MaybePromise<T5>>,
    f6: UnaryFn<T5, MaybePromise<T6>>,
    f7: UnaryFn<T6, MaybePromise<T7>>,
    f8: UnaryFn<T7, MaybePromise<T8>>,
    f9: UnaryFn<T8, MaybePromise<T9>>,
    f10: UnaryFn<T9, MaybePromise<T10>>,
    f11: UnaryFn<T10, MaybePromise<Task | Empty>>
  ): Task.Async;
  <T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(
    f1: UnaryFn<Context, MaybePromise<T1>>,
    f2: UnaryFn<T1, MaybePromise<T2>>,
    f3: UnaryFn<T2, MaybePromise<T3>>,
    f4: UnaryFn<T3, MaybePromise<T4>>,
    f5: UnaryFn<T4, MaybePromise<T5>>,
    f6: UnaryFn<T5, MaybePromise<T6>>,
    f7: UnaryFn<T6, MaybePromise<T7>>,
    f8: UnaryFn<T7, MaybePromise<T8>>,
    f9: UnaryFn<T8, MaybePromise<T9>>,
    f10: UnaryFn<T9, MaybePromise<T10>>,
    f11: UnaryFn<T10, MaybePromise<T11>>,
    f12: UnaryFn<T11, MaybePromise<Task | Empty>>
  ): Task.Async;
  <T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12>(
    f1: UnaryFn<Context, MaybePromise<T1>>,
    f2: UnaryFn<T1, MaybePromise<T2>>,
    f3: UnaryFn<T2, MaybePromise<T3>>,
    f4: UnaryFn<T3, MaybePromise<T4>>,
    f5: UnaryFn<T4, MaybePromise<T5>>,
    f6: UnaryFn<T5, MaybePromise<T6>>,
    f7: UnaryFn<T6, MaybePromise<T7>>,
    f8: UnaryFn<T7, MaybePromise<T8>>,
    f9: UnaryFn<T8, MaybePromise<T9>>,
    f10: UnaryFn<T9, MaybePromise<T10>>,
    f11: UnaryFn<T10, MaybePromise<T11>>,
    f12: UnaryFn<T11, MaybePromise<T12>>,
    f13: UnaryFn<T12, MaybePromise<Task | Empty>>
  ): Task.Async;
  <T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13>(
    f1: UnaryFn<Context, MaybePromise<T1>>,
    f2: UnaryFn<T1, MaybePromise<T2>>,
    f3: UnaryFn<T2, MaybePromise<T3>>,
    f4: UnaryFn<T3, MaybePromise<T4>>,
    f5: UnaryFn<T4, MaybePromise<T5>>,
    f6: UnaryFn<T5, MaybePromise<T6>>,
    f7: UnaryFn<T6, MaybePromise<T7>>,
    f8: UnaryFn<T7, MaybePromise<T8>>,
    f9: UnaryFn<T8, MaybePromise<T9>>,
    f10: UnaryFn<T9, MaybePromise<T10>>,
    f11: UnaryFn<T10, MaybePromise<T11>>,
    f12: UnaryFn<T11, MaybePromise<T12>>,
    f13: UnaryFn<T12, MaybePromise<T13>>,
    f14: UnaryFn<T13, MaybePromise<Task | Empty>>
  ): Task.Async;
  <T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14>(
    f1: UnaryFn<Context, MaybePromise<T1>>,
    f2: UnaryFn<T1, MaybePromise<T2>>,
    f3: UnaryFn<T2, MaybePromise<T3>>,
    f4: UnaryFn<T3, MaybePromise<T4>>,
    f5: UnaryFn<T4, MaybePromise<T5>>,
    f6: UnaryFn<T5, MaybePromise<T6>>,
    f7: UnaryFn<T6, MaybePromise<T7>>,
    f8: UnaryFn<T7, MaybePromise<T8>>,
    f9: UnaryFn<T8, MaybePromise<T9>>,
    f10: UnaryFn<T9, MaybePromise<T10>>,
    f11: UnaryFn<T10, MaybePromise<T11>>,
    f12: UnaryFn<T11, MaybePromise<T12>>,
    f13: UnaryFn<T12, MaybePromise<T13>>,
    f14: UnaryFn<T13, MaybePromise<T14>>,
    f15: UnaryFn<T14, MaybePromise<Task | Empty>>
  ): Task.Async;
}
