import path from 'path';
import fs from 'fs-extra';
import { rejects } from 'errorish';
import core from '~/core';
import { absolute, exists } from '~/utils/file';
import confirm from '../prompts/confirm';
import { parallel } from 'promist';
import logger from '~/utils/logger';
import chalk from 'chalk';
import expose from '~/utils/expose';
import { IFsReadOptions } from './types';

export default expose(remove);
/**
 * Removes a file, a directory -recursively-, or an array of them.
 * It is an *exposed* function: call `remove.fn()`, which takes the same arguments, in order to execute on call.
 * @param paths a path for a file or directory, or an array of them.
 * @param options an `IRemoveOptions` object.
 * @returns An asynchronous function -hence, calling `remove` won't have any effect until the returned function is called.
 */
function remove(
  paths: string | string[],
  options: IFsReadOptions = {}
): () => Promise<void> {
  return async () => {
    options = Object.assign({ confirm: false, fail: true }, options);

    const cwd = await core.cwd();
    paths = Array.isArray(paths) ? paths : [paths];
    paths = paths.map((path) => absolute({ path, cwd }));

    const existingPaths = await parallel.filter(paths, (path) => exists(path));
    const nonExistingPaths = paths.filter(
      (path) => !existingPaths.includes(path)
    );
    const relatives = {
      existing: existingPaths.map((x) => path.relative(cwd, x)),
      nonExisting: nonExistingPaths.map((x) => path.relative(cwd, x))
    };

    if (options.fail && nonExistingPaths.length) {
      throw Error(`Path to remove doesn't exist: ${relatives.nonExisting[0]}`);
    }

    // eslint-disable-next-line no-console
    (options.confirm ? console.log : logger.debug)(
      chalk.bold.yellow(
        relatives.existing.length ? 'Paths to remove' : 'No paths to remove'
      ) +
        (relatives.existing.length
          ? `\n    Existing paths: "${relatives.existing.join('", "')}"`
          : '') +
        (relatives.nonExisting.length
          ? `\n    Non existing paths: "${relatives.nonExisting.join('", "')}"`
          : '')
    );

    if (!existingPaths.length) return;
    if (options.confirm) {
      const action = await confirm.fn({ no: false }).then((x) => x !== false);

      if (!action) {
        if (options.fail) throw Error(`Cancelled by user`);
        else return;
      }
    }

    await parallel.each(existingPaths, async (absolute, i) => {
      await fs.remove(absolute).catch(rejects);

      const relative = relatives.existing[i];
      logger.debug(`Removed: ${relative}`);
    });

    logger.info(`Removed: "${relatives.existing.join('", "')}"`);
  };
}
