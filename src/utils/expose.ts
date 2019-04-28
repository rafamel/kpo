import { TScriptFn } from '~/types';
import { wrap } from './errors';

export type TExposedOverload<
  T extends (...args: any[]) => TScriptFn,
  O extends any[]
> = TExposed<T> & {
  fn: (...args: O) => ReturnType<ReturnType<T>>;
};
export type TExposed<T extends (...args: any[]) => TScriptFn> = T & {
  fn: TExposedFn<T, ReturnType<T>>;
};
export type TExposedFn<T, R extends TScriptFn> = T extends (
  ...args: infer U
) => R
  ? (...args: U) => ReturnType<R>
  : T;

export default function expose<T extends (...args: any[]) => TScriptFn>(
  fn: T
): TExposed<T> {
  const exposed = function(...args: any[]): any {
    return (argv?: string[]) => {
      return wrap.throws(() => fn(...args)(argv));
    };
  };
  exposed.fn = function(...args: any[]) {
    return exposed(...args)([]);
  };

  return exposed as any;
}
