import expose, { TExposedOverload } from '~/utils/expose';
import { IFsUpdateOptions, TWriteFn, TSource } from '../types';
import trunk from './write';

export default expose(write) as TExposedOverload<
  typeof write,
  | [TSource]
  | [TSource, undefined | string | TWriteFn]
  | [TSource, IFsUpdateOptions]
  | [TSource, undefined | string | TWriteFn, IFsUpdateOptions]
>;

function write(dest: TSource, content?: string | TWriteFn): () => Promise<void>;
function write(dest: TSource, options?: IFsUpdateOptions): () => Promise<void>;
function write(
  dest: TSource,
  content?: string | TWriteFn,
  options?: IFsUpdateOptions
): () => Promise<void>;
/**
 * Writes a `file` with `raw`. If no `raw` content is passed, it will overwrite with no content.
 * It is an *exposed* function: call `write.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function -hence, calling `write` won't have any effect until the returned function is called.
 */
function write(dest: TSource, ...args: any[]): () => Promise<void> {
  return async () => {
    const hasRaw =
      typeof args[0] === 'string' ||
      typeof args[0] === 'function' ||
      typeof args[0] === 'undefined';

    return trunk(
      typeof dest === 'function' ? await dest() : await dest,
      hasRaw ? args[0] : undefined,
      hasRaw ? args[1] : args[0]
    );
  };
}
