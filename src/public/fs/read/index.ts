import expose from '~/utils/expose';
import { TScript } from '~/types';
import { TSource, IFsReadOptions, TReadFn } from '../types';
import trunk from './read';

export default expose(read);

/**
 * Reads a `file` and passes it as an argument to a callback `fn`, which can return a `TScript`.
 * It is an *exposed* function: call `read.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function -hence, calling `read` won't have any effect until the returned function is called.
 */
function read(
  src: TSource,
  fn: TReadFn,
  options?: IFsReadOptions
): () => Promise<TScript> {
  return async () => {
    return trunk(
      typeof src === 'function' ? await src() : await src,
      fn,
      options
    );
  };
}
