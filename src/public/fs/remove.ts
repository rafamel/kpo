import path from 'path';
import fs from 'fs-extra';
import { absolute, exists } from '~/utils/file';
import confirm from '~/utils/confirm';
import { parallel } from 'promist';
import logger from '~/utils/logger';
import chalk from 'chalk';
import expose from '~/utils/expose';
import { IFsCreateDeleteOptions } from './types';

export default expose(remove);
/**
 * Removes a file, a directory -recursively-, or an array of them.
 * It is an *exposed* function: call `remove.fn()`, which takes the same arguments, in order to execute on call.
 * @param paths a path for a file or directory, or an array of them.
 * @param options an `IFsCreateDeleteOptions` object.
 * @returns An asynchronous function -hence, calling `remove` won't have any effect until the returned function is called.
 */
function remove(
  paths: string | string[] | Promise<string | string[]>,
  options: IFsCreateDeleteOptions = {}
): () => Promise<void> {
  return async () => {
    const cwd = process.cwd();
    paths = await paths;
    paths = Array.isArray(paths) ? paths : [paths];
    paths = paths.map((path) => absolute({ path, cwd }));

    const existingPaths = await parallel.filter(paths, (path) => exists(path));
    const nonExistingPaths = paths.filter(
      (path) => !existingPaths.includes(path)
    );
    const relatives = {
      existing: existingPaths.map((x) => './' + path.relative(cwd, x)),
      nonExisting: nonExistingPaths.map((x) => './' + path.relative(cwd, x))
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

    if (!existingPaths.length) {
      logger.info(
        `Remove skipped: "${relatives.existing
          .concat(relatives.nonExisting)
          .join('", "')}"`
      );
      return;
    }
    if (!(await confirm('Remove?', options))) return;

    await parallel.each(existingPaths, async (absolute, i) => {
      await fs.remove(absolute);

      const relative = relatives.existing[i];
      logger.debug(`Removed: ${relative}`);
    });
    logger.info(`Removed: "${relatives.existing.join('", "')}"`);
  };
}
