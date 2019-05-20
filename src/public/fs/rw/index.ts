import expose, { TExposedOverload } from '~/utils/expose';
import trunk from './rw';
import {
  IFsUpdateOptions,
  TSource,
  TReadWriteFn,
  TDestination
} from '../types';

export default expose(rw) as TExposedOverload<
  typeof rw,
  | [TSource, TDestination, TReadWriteFn, IFsUpdateOptions]
  | [TSource, TDestination, TReadWriteFn]
  | [TSource, TReadWriteFn, IFsUpdateOptions]
  | [TSource, TReadWriteFn]
>;

function rw(
  src: TSource,
  dest: TDestination,
  fn: TReadWriteFn,
  options?: IFsUpdateOptions
): () => Promise<void>;
function rw(
  src: TSource,
  fn: TReadWriteFn,
  options?: IFsUpdateOptions
): () => Promise<void>;
/**
 * Reads a `file` and passes it as an argument to a callback `fn`. If the callback returns other than `undefined`, **`file` will be overwritten** with its contents. `file` can be relative to the project's directory. If a `dest` destination is provided, the original file won't be overwritten or removed.
 * It is an *exposed* function: call `rw.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function -hence, calling `rw` won't have any effect until the returned function is called.
 */
function rw(src: TSource, ...args: any[]): () => Promise<void> {
  return async () => {
    const hasDest = typeof args[0] !== 'function';
    src = typeof src === 'function' ? await src() : await src;
    return trunk(
      src,
      hasDest ? args[0] : src,
      hasDest ? args[1] : args[0],
      hasDest ? args[2] : args[1]
    );
  };
}
