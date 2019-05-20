import fs from 'fs-extra';
import path from 'path';
import expose, { TExposedOverload } from '~/utils/expose';
import { IFsUpdateOptions } from './types';
import { exists, absolute } from '~/utils/file';
import confirm from '~/utils/confirm';
import logger from '~/utils/logger';
import { open } from '~/utils/errors';

export default expose(write) as TExposedOverload<
  typeof write,
  | [string]
  | [string, string | (() => string | Promise<string>)]
  | [string, IFsUpdateOptions]
  | [string, string | (() => string | Promise<string>), IFsUpdateOptions]
>;

function write(
  file: string,
  raw?: string | (() => string | Promise<string>)
): () => Promise<void>;
function write(file: string, options?: IFsUpdateOptions): () => Promise<void>;
function write(
  file: string,
  raw: string | (() => string | Promise<string>),
  options?: IFsUpdateOptions
): () => Promise<void>;
/**
 * Writes a `file` with `raw`. If no `raw` content is passed, it will simply ensure it does exist.
 * It is an *exposed* function: call `write.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function -hence, calling `write` won't have any effect until the returned function is called.
 */
function write(file: string, ...args: any[]): () => Promise<void> {
  return async () => {
    const hasRaw = typeof args[0] === 'string' || typeof args[0] === 'function';
    const options: IFsUpdateOptions = Object.assign(
      { overwrite: true },
      (hasRaw ? args[1] : args[0]) || {}
    );
    let raw: string | (() => string | Promise<string>) = hasRaw ? args[0] : '';
    if (typeof raw === 'function') {
      try {
        raw = await raw();
      } catch (err) {
        throw open(err);
      }
    }

    const cwd = process.cwd();
    file = absolute({ path: file, cwd });
    const relative = './' + path.relative(process.cwd(), file);

    const doesExist = await exists(file);
    if (options.fail && doesExist) {
      throw Error(`File already exists: ${relative}`);
    }

    if (doesExist && !options.overwrite) {
      logger.info(`Write skipped: ${relative}`);
      return;
    }

    if (!(await confirm(`Write "${relative}"?`, options))) return;

    await fs.ensureDir(path.parse(file).dir);
    await fs.writeFile(file, String(raw));
    logger.info(`Written: ${relative}`);
  };
}
