import path from 'path';
import fs from 'fs-extra';
import { exists, absolute } from '~/utils/file';
import core from '~/core';
import { rejects } from 'errorish';
import expose from '~/utils/expose';
import confirm from '~/utils/confirm';
import { IFsOptions } from './types';
import logger from '~/utils/logger';

export default expose(rw);

/**
 * Reads a `file` and passes it as an argument to a callback `fn`. If the callback returns other than `undefined`, **`file` will be overwritten** with its contents. `file` can be relative to the project's directory.
 * It is an *exposed* function: call `rw.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function -hence, calling `rw` won't have any effect until the returned function is called.
 */
function rw(
  file: string,
  fn: (raw?: string) => string | void | Promise<string | void>,
  options: IFsOptions = {}
): () => Promise<void> {
  return async () => {
    const paths = await core.paths();
    file = absolute({ path: file, cwd: paths.directory });
    const relative = './' + path.relative(paths.directory, file);

    const doesExist = await exists(file, { fail: options.fail });

    const raw = doesExist
      ? await fs
          .readFile(file)
          .then(String)
          .catch(rejects)
      : undefined;

    const response = await fn(raw);
    if (response === undefined) {
      logger.info(`Write skipped: ${relative}`);
      return;
    }

    if (!(await confirm(`Write "${relative}"?`, options))) return;

    await fs.ensureDir(path.parse(file).dir).catch(rejects);
    await fs.writeFile(file, String(response)).catch(rejects);
    logger.info(`Written: ${relative}`);
  };
}
