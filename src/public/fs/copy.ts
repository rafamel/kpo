import path from 'path';
import fs from 'fs-extra';
import { absolute, exists } from '~/utils/file';
import { IFsWriteOptions } from './types';
import expose, { TExposedOverload } from '~/utils/expose';
import confirm from '~/utils/confirm';
import logger from '~/utils/logger';
import { open } from '~/utils/errors';

export type TCopyFilterFn =
  | ((src: string, dest: string) => boolean)
  | ((src: string, dest: string) => Promise<boolean>);

export default expose(copy) as TExposedOverload<
  typeof copy,
  | [string | string[] | Promise<string | string[]>, string]
  | [string | string[] | Promise<string | string[]>, string, IFsWriteOptions]
  | [string | string[] | Promise<string | string[]>, string, TCopyFilterFn]
  | [
      string | string[] | Promise<string | string[]>,
      string,
      IFsWriteOptions | undefined,
      TCopyFilterFn
    ]
>;

function copy(
  src: string | string[] | Promise<string | string[]>,
  dest: string,
  filter?: TCopyFilterFn
): () => Promise<void>;
function copy(
  src: string | string[] | Promise<string | string[]>,
  dest: string,
  options?: IFsWriteOptions,
  filter?: TCopyFilterFn
): () => Promise<void>;
/**
 * Recursive copy. If an array of paths is passed as `src`, `dest` will be expected to be a directory.
 * It is an *exposed* function: call `copy.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function -hence, calling `copy` won't have any effect until the returned function is called.
 */
function copy(
  src: string | string[] | Promise<string | string[]>,
  dest: string,
  ...args: any[]
): () => Promise<void> {
  return async () => {
    src = await src;
    if (Array.isArray(src)) {
      for (let source of src) {
        await trunk(source, path.join(dest, path.parse(source).base), args);
      }
    } else {
      await trunk(src, dest, args);
    }
  };
}

/** @hidden */
export async function trunk(
  src: string,
  dest: string,
  args: any[]
): Promise<void> {
  const options: IFsWriteOptions = Object.assign(
    { overwrite: true },
    args.find((x) => typeof x === 'object') || {}
  );
  let filter: TCopyFilterFn =
    args.find((x) => typeof x === 'function') || (() => true);

  const cwd = process.cwd();
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

  await fs.copy(src, dest, {
    overwrite: options.overwrite,
    errorOnExist: options.fail,
    async filter(src: string, dest: string): Promise<boolean> {
      try {
        return await filter(src, dest);
      } catch (err) {
        throw open(err);
      }
    }
  });
  logger.info(`Copied: "${relatives.src}" to "${relatives.dest}"`);
}
