import {
  TSource,
  IFsUpdateOptions,
  TCopyFilterFn,
  TDestination
} from '../types';
import expose, { TExposedOverload } from '~/utils/expose';
import trunk from './copy';

export default expose(copy) as TExposedOverload<
  typeof copy,
  | [TSource, TDestination]
  | [TSource, TDestination, IFsUpdateOptions]
  | [TSource, TDestination, TCopyFilterFn]
  | [TSource, TDestination, IFsUpdateOptions | undefined, TCopyFilterFn]
>;

function copy(
  src: TSource,
  dest: TDestination,
  filter?: TCopyFilterFn
): () => Promise<void>;
function copy(
  src: TSource,
  dest: TDestination,
  options?: IFsUpdateOptions,
  filter?: TCopyFilterFn
): () => Promise<void>;
/**
 * Recursive copy. If an array of paths is passed as `src`, `dest` will be expected to be a directory.
 * It is an *exposed* function: call `copy.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function -hence, calling `copy` won't have any effect until the returned function is called.
 */
function copy(
  src: TSource,
  dest: TDestination,
  ...args: any[]
): () => Promise<void> {
  return async () => {
    const hasOptions = typeof args[0] !== 'function';
    return trunk(
      typeof src === 'function' ? await src() : await src,
      dest,
      hasOptions ? args[0] : undefined,
      hasOptions ? args[1] : args[0]
    );
  };
}
