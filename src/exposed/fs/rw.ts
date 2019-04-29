import path from 'path';
import fs from 'fs-extra';
import { exists, absolute } from '~/utils/file';
import core from '~/core';
import { rejects } from 'errorish';
import expose from '~/utils/expose';
import confirm from './utils/confirm';
import { IFsOptions } from './types';
import write from './utils/write';

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
    const cwd = await core.cwd();
    file = absolute({ path: file, cwd });
    const relative = path.relative(cwd, file);

    const doesExist = await exists(file, { fail: options.fail });

    const raw = doesExist
      ? await fs
          .readFile(file)
          .then(String)
          .catch(rejects)
      : undefined;

    const response = await fn(raw);
    if (response !== undefined) {
      if (!(await confirm(`Write "${relative}"?`, options))) return;
      await write(file, relative, response);
    }
  };
}
