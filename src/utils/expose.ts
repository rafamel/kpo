import { TScriptFn } from '~/types';
import { error } from './errors';
import { isPromise } from 'promist';

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
      let res: any;
      try {
        res = fn(...args)(argv);
      } catch (err) {
        throw error(err);
      }
      return isPromise(res)
        ? res.catch((err: Error) => Promise.reject(error(err)))
        : res;
    };
  };
  exposed.fn = function(...args: any[]) {
    return exposed(...args)([]);
  };

  return exposed as any;
}
