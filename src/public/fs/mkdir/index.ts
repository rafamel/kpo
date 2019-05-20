import expose from '~/utils/expose';
import trunk from './mkdir';
import { TSource, IFsCreateDeleteOptions } from '../types';

export default expose(mkdir);

/**
 * Deep creates a directory or an array of them.
 * It is an *exposed* function: call `mkdir.fn()`, which takes the same arguments, in order to execute on call.
 * @param paths a path for a directory, or an array of them.
 * @param options an `IFsCreateDeleteOptions` object.
 * @returns An asynchronous function -hence, calling `mkdir` won't have any effect until the returned function is called.
 */
function mkdir(
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
