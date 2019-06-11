import expose, { TExposedOverload } from '~/utils/expose';
import rw from './rw';
import { IOfType } from '~/types';
import {
  IFsUpdateOptions,
  TReadWriteFn,
  TSource,
  TJsonFn,
  TDestination
} from './types';

export default expose(json) as TExposedOverload<
  typeof json,
  | [TSource, TDestination, TJsonFn, IFsUpdateOptions]
  | [TSource, TDestination, TJsonFn]
  | [TSource, TJsonFn, IFsUpdateOptions]
  | [TSource, TJsonFn]
>;

function json(
  src: TSource,
  dest: TDestination,
  fn: TJsonFn,
  options?: IFsUpdateOptions
): () => Promise<void>;
function json(
  src: TSource,
  fn: TJsonFn,
  options?: IFsUpdateOptions
): () => Promise<void>;

/**
 * Reads a JSON `file` and passes it as an argument to a callback `fn`. If the callback returns other than `undefined`, **`file` will be overwritten** with the JSON parsed response. `file` can be relative to the project's directory. If a `dest` destination is provided, the original file won't be overwritten or removed.
 * It is an *exposed* function: call `json.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function -hence, calling `json` won't have any effect until the returned function is called.
 */
function json(src: TSource, ...args: any[]): () => Promise<void> {
  return async () => {
    const hasDest = typeof args[0] !== 'function';
    const dest: TDestination = hasDest ? args[0] : src;
    const fn: TJsonFn = hasDest ? args[1] : args[0];
    const options: IFsUpdateOptions = hasDest ? args[2] : args[1];

    const _fn: TReadWriteFn = async (data) => {
      Object.defineProperty(data, 'json', {
        enumerable: true,
        get: (): IOfType<any> => (data.raw ? JSON.parse(data.raw) : undefined)
      });
      const json = await fn(data);
      return json ? JSON.stringify(json, null, 2) : undefined;
    };

    return rw.fn(src, dest, _fn, options);
  };
}
