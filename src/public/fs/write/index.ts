import expose, { TExposedOverload } from '~/utils/expose';
import { IFsUpdateOptions, TContentFn, TSource } from '../types';
import trunk from './write';

export default expose(write) as TExposedOverload<
  typeof write,
  | [TSource]
  | [TSource, undefined | string | TContentFn]
  | [TSource, IFsUpdateOptions]
  | [TSource, undefined | string | TContentFn, IFsUpdateOptions]
>;

function write(file: TSource, raw?: string | TContentFn): () => Promise<void>;
function write(file: TSource, options?: IFsUpdateOptions): () => Promise<void>;
function write(
  file: TSource,
  raw?: string | TContentFn,
  options?: IFsUpdateOptions
): () => Promise<void>;
/**
 * Writes a `file` with `raw`. If no `raw` content is passed, it will overwrite with no content.
 * It is an *exposed* function: call `write.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function -hence, calling `write` won't have any effect until the returned function is called.
 */
function write(file: TSource, ...args: any[]): () => Promise<void> {
  return async () => {
    const hasRaw =
      typeof args[0] === 'string' ||
      typeof args[0] === 'function' ||
      typeof args[0] === 'undefined';

    return trunk(
      typeof file === 'function' ? await file() : await file,
      hasRaw ? args[0] : undefined,
      hasRaw ? args[1] : args[0]
    );
  };
}
