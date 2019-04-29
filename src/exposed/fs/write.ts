import path from 'path';
import expose, { TExposedOverload } from '~/utils/expose';
import core from '~/core';
import { IFsWriteOptions } from './types';
import { exists, absolute } from '~/utils/file';
import confirm from './utils/confirm';
import _write from './utils/write';
import logger from '~/utils/logger';

export default expose(write) as TExposedOverload<
  typeof write,
  | [string]
  | [string, string]
  | [string, IFsWriteOptions]
  | [string, string, IFsWriteOptions]
>;

function write(file: string, raw?: string): () => Promise<void>;
function write(file: string, options?: IFsWriteOptions): () => Promise<void>;
function write(
  file: string,
  raw: string,
  options?: IFsWriteOptions
): () => Promise<void>;
/**
 * Writes a `file` with `raw`. If no `raw` content is passed, it will simply ensure it does exist.
 * It is an *exposed* function: call `write.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function -hence, calling `write` won't have any effect until the returned function is called.
 */
function write(file: string, ...args: any[]): () => Promise<void> {
  return async () => {
    const raw: string = args.find((x) => typeof x === 'string') || '';
    const options: IFsWriteOptions = Object.assign(
      { overwrite: true },
      args.find((x) => typeof x === 'object') || {}
    );

    const cwd = await core.cwd();
    file = absolute({ path: file, cwd });
    const relative = './' + path.relative(cwd, file);

    const doesExist = await exists(file);
    if (options.fail && doesExist) {
      throw Error(`File already exists: ${relative}`);
    }

    if (doesExist && !options.overwrite) {
      logger.info(`Write skipped: ${relative}`);
      return;
    }

    if (!(await confirm(`Write "${relative}"?`, options))) return;

    await _write(file, raw);
    logger.info(`Written: ${relative}`);
  };
}
