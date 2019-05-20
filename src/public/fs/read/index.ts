import expose from '~/utils/expose';
import { TScript } from '~/types';
import { TSource, IFsReadOptions } from '../types';
import trunk from './read';

export default expose(read);

/**
 * Reads a `file` and passes it as an argument to a callback `fn`, which can return a `TScript`.
 * It is an *exposed* function: call `read.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function -hence, calling `read` won't have any effect until the returned function is called.
 */
function read(
  file: TSource,
  fn: (raw?: string) => TScript,
  options?: IFsReadOptions
): () => Promise<TScript> {
  return async () => {
    return trunk(
      typeof file === 'function' ? await file() : await file,
      fn,
      options
    );
  };
}
