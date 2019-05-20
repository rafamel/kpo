import expose from '~/utils/expose';
import { IFsUpdateOptions, TSource, TContentFn } from '../types';
import trunk from './rw';

export default expose(rw);

/**
 * Reads a `file` and passes it as an argument to a callback `fn`. If the callback returns other than `undefined`, **`file` will be overwritten** with its contents. `file` can be relative to the project's directory.
 * It is an *exposed* function: call `rw.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function -hence, calling `rw` won't have any effect until the returned function is called.
 */
function rw(
  file: TSource,
  fn: TContentFn,
  options?: IFsUpdateOptions
): () => Promise<void> {
  return async () => {
    return trunk(
      typeof file === 'function' ? await file() : await file,
      fn,
      options
    );
  };
}
