import path from 'path';
import fs from 'fs-extra';
import { absolute, exists } from '~/utils/file';
import confirm from '~/utils/confirm';
import { parallel } from 'promist';
import chalk from 'chalk';
import { IFsCreateDeleteOptions } from '../types';
import { log } from '../utils';

export default async function remove(
  paths: string | string[],
  options: IFsCreateDeleteOptions = {}
): Promise<void> {
  const cwd = process.cwd();
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
  (options.confirm ? console.log : log(options, 'debug'))(
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
    log(options, 'info')(
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
    log(options, 'debug')(`Removed: ${relative}`);
  });
  log(options, 'info')(`Removed: "${relatives.existing.join('", "')}"`);
}
