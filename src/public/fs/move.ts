import path from 'path';
import fs from 'fs-extra';
import core from '~/core';
import { absolute, exists } from '~/utils/file';
import { IFsWriteOptions } from './types';
import expose from '~/utils/expose';
import confirm from '~/utils/confirm';
import { rejects } from 'errorish';
import logger from '~/utils/logger';

export default expose(move);

/**
 * Move files or directories. If an array of paths is passed as `src`, `dest` will be expected to be a directory.
 * It is an *exposed* function: call `move.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function -hence, calling `move` won't have any effect until the returned function is called.
 */
function move(
  src: string | string[],
  dest: string,
  options: IFsWriteOptions = {}
): () => Promise<void> {
  return async () => {
    if (Array.isArray(src)) {
      for (let source of src) {
        await trunk(source, path.join(dest, path.parse(source).base), options);
      }
    } else {
      await trunk(src, dest, options);
    }
  };
}

/** @hidden */
export async function trunk(
  src: string,
  dest: string,
  options: IFsWriteOptions
): Promise<void> {
  options = Object.assign({ overwrite: true }, options);

  const paths = await core.paths();
  src = absolute({ path: src, cwd: paths.directory });
  dest = absolute({ path: dest, cwd: paths.directory });

  const relatives = {
    src: './' + path.relative(paths.directory, src),
    dest: './' + path.relative(paths.directory, dest)
  };

  const srcExist = await exists(src, { fail: options.fail });
  if (!srcExist) {
    logger.info(`Move skipped: "${relatives.src}" to "${relatives.dest}"`);
    return;
  }

  const destExists = await exists(dest);
  if (destExists) {
    if (options.fail) {
      throw Error(`Destination already exists: ${relatives.dest}`);
    }
    if (!options.overwrite) {
      logger.info(`Move skipped: "${relatives.src}" to "${relatives.dest}"`);
      return;
    }
  }

  const msg = `Move "${relatives.src}" to "${relatives.dest}"?`;
  if (!(await confirm(msg, options))) return;

  await fs.move(src, dest, { overwrite: options.overwrite }).catch(rejects);
  logger.info(`Moved: "${relatives.src}" to "${relatives.dest}"`);
}
