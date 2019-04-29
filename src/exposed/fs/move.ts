import path from 'path';
import fs from 'fs-extra';
import core from '~/core';
import { absolute, exists } from '~/utils/file';
import { IFsWriteOptions } from './types';
import expose from '~/utils/expose';
import confirm from './utils/confirm';
import { rejects } from 'errorish';
import logger from '~/utils/logger';

export default expose(move);

/**
 * Move files or directories.
 * It is an *exposed* function: call `move.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function -hence, calling `move` won't have any effect until the returned function is called.
 */
function move(
  src: string,
  dest: string,
  options: IFsWriteOptions = {}
): () => Promise<void> {
  return async () => {
    options = Object.assign({ overwrite: true }, options);

    const cwd = await core.cwd();
    src = absolute({ path: src, cwd });
    dest = absolute({ path: dest, cwd });

    const relatives = {
      src: './' + path.relative(cwd, src),
      dest: './' + path.relative(cwd, dest)
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
  };
}
