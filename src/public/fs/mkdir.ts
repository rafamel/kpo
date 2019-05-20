import path from 'path';
import fs from 'fs-extra';
import { absolute, exists } from '~/utils/file';
import confirm from '~/utils/confirm';
import { parallel } from 'promist';
import logger from '~/utils/logger';
import chalk from 'chalk';
import expose from '~/utils/expose';
import { IFsCreateDeleteOptions, TSource } from './types';

export default expose(mkdir);
/**
 * Deep creates a directory or an array of them.
 * It is an *exposed* function: call `mkdir.fn()`, which takes the same arguments, in order to execute on call.
 * @param paths a path for a directory, or an array of them.
 * @param options an `IFsCreateDeleteOptions` object.
 * @returns An asynchronous function -hence, calling `mkdir` won't have any effect until the returned function is called.
 */
function mkdir(
  paths: TSource,
  options: IFsCreateDeleteOptions = {}
): () => Promise<void> {
  return async () => {
    const cwd = process.cwd();
    paths = typeof paths === 'function' ? await paths() : await paths;
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

    if (options.fail && existingPaths.length) {
      throw Error(`Directory already exists: ${relatives.existing[0]}`);
    }

    // eslint-disable-next-line no-console
    (options.confirm ? console.log : logger.debug)(
      chalk.bold.yellow(
        relatives.existing.length
          ? 'Directories to create'
          : 'No directories to create'
      ) +
        (relatives.existing.length
          ? `\n    Existing paths: "${relatives.existing.join('", "')}"`
          : '') +
        (relatives.nonExisting.length
          ? `\n    Non existing paths: "${relatives.nonExisting.join('", "')}"`
          : '')
    );

    if (!nonExistingPaths.length) {
      logger.info(
        `Create skipped: "${relatives.existing
          .concat(relatives.nonExisting)
          .join('", "')}"`
      );
      return;
    }
    if (!(await confirm('Create?', options))) return;

    await parallel.each(nonExistingPaths, async (absolute, i) => {
      await fs.ensureDir(absolute);

      const relative = relatives.nonExisting[i];
      logger.debug(`Created: ${relative}`);
    });
    logger.info(`Created: "${relatives.nonExisting.join('", "')}"`);
  };
}
