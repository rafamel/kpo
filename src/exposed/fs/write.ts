import expose, { TExposedOverload } from '~/utils/expose';
import rw from './rw';
import { IFsOptions } from './types';

export default expose(write) as TExposedOverload<
  typeof write,
  | [string]
  | [string, string]
  | [string, IFsOptions]
  | [string, string, IFsOptions]
>;

function write(file: string, raw?: string): () => Promise<void>;
function write(file: string, options?: IFsOptions): () => Promise<void>;
function write(
  file: string,
  raw: string,
  options?: IFsOptions
): () => Promise<void>;
/**
 * Writes a `file` with `raw`. If no `raw` content is passed, it will simply ensure it does exist.
 */
function write(file: string, ...args: any[]): () => Promise<void> {
  return async () => {
    const raw: string = args.find((x) => typeof x === 'string');
    const options: IFsOptions = args.find((x) => typeof x === 'object') || {};

    return rw.fn(
      file,
      (content) => {
        if (raw) return raw;
        return content === undefined ? '' : undefined;
      },
      { confirm: false, ...options, fail: false }
    );
  };
}
