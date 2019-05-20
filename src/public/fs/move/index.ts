import { TSource, IFsUpdateOptions } from '../types';
import expose from '~/utils/expose';
import trunk from './move';

export default expose(move);

/**
 * Move files or directories. If an array of paths is passed as `src`, `dest` will be expected to be a directory.
 * It is an *exposed* function: call `move.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function -hence, calling `move` won't have any effect until the returned function is called.
 */
function move(
  src: TSource,
  dest: string,
  options?: IFsUpdateOptions
): () => Promise<void> {
  return async () => {
    return trunk(
      typeof src === 'function' ? await src() : await src,
      dest,
      options
    );
  };
}
