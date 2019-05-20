import expose from '~/utils/expose';
import { IFsCreateDeleteOptions, TSource } from '../types';
import trunk from './remove';

export default expose(remove);

/**
 * Removes a file, a directory -recursively-, or an array of them.
 * It is an *exposed* function: call `remove.fn()`, which takes the same arguments, in order to execute on call.
 * @param paths a path for a file or directory, or an array of them.
 * @param options an `IFsCreateDeleteOptions` object.
 * @returns An asynchronous function -hence, calling `remove` won't have any effect until the returned function is called.
 */
function remove(
  paths: TSource,
  options?: IFsCreateDeleteOptions
): () => Promise<void> {
  return async () => {
    return trunk(
      typeof paths === 'function' ? await paths() : await paths,
      options
    );
  };
}
