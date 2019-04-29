import path from 'path';
import fs from 'fs-extra';
import core from '~/core';
import { absolute, exists } from '~/utils/file';
import { IFsWriteOptions } from './types';
import expose, { TExposedOverload } from '~/utils/expose';
import confirm from './utils/confirm';
import { rejects } from 'errorish';
import logger from '~/utils/logger';

export type TCopyFilterFn =
  | ((src: string, dest: string) => boolean)
  | ((src: string, dest: string) => Promise<boolean>);

export default expose(copy) as TExposedOverload<
  typeof copy,
  | [string, string]
  | [string, string, IFsWriteOptions]
  | [string, string, TCopyFilterFn]
  | [string, string, IFsWriteOptions | undefined, TCopyFilterFn]
>;

function copy(
  src: string,
  dest: string,
  filter?: TCopyFilterFn
): () => Promise<void>;
function copy(
  src: string,
  dest: string,
  options?: IFsWriteOptions,
  filter?: TCopyFilterFn
): () => Promise<void>;
/**
 * Recursive copy.
 * It is an *exposed* function: call `copy.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function -hence, calling `copy` won't have any effect until the returned function is called.
 */
function copy(src: string, dest: string, ...args: any[]): () => Promise<void> {
  return async () => {
    const options: IFsWriteOptions = Object.assign(
      { overwrite: true },
      args.find((x) => typeof x === 'object') || {}
    );
    const filter: TCopyFilterFn =
      args.find((x) => typeof x === 'function') || (() => true);

    const cwd = await core.cwd();
    src = absolute({ path: src, cwd });
    dest = absolute({ path: dest, cwd });

    const relatives = {
      src: './' + path.relative(cwd, src),
      dest: './' + path.relative(cwd, dest)
    };

    const srcExist = await exists(src, { fail: options.fail });
    if (!srcExist) {
      logger.info(`Copy skipped: "${relatives.src}" to "${relatives.dest}"`);
      return;
    }

    const msg = `Copy "${relatives.src}" to "${relatives.dest}"?`;
    if (!(await confirm(msg, options))) return;

    await fs
      .copy(src, dest, {
        overwrite: options.overwrite,
        errorOnExist: options.fail,
        filter
      })
      .catch(rejects);
    logger.info(`Copied: "${relatives.src}" to "${relatives.dest}"`);
  };
}