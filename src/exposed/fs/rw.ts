import path from 'path';
import fs from 'fs-extra';
import { exists, absolute } from '~/utils/file';
import core from '~/core';
import { rejects } from 'errorish';
import expose from '~/utils/expose';
import confirm from '../prompts/confirm';
import { IFsReadOptions } from './types';
import ensure from '../tags/ensure';

export default expose(rw);

/**
 * Reads a `file` and passes it as an argument to a callback `fn`. If the callback returns other than `undefined`, **`file` will be overwritten** with its contents. `file` can be relative to the project's directory.
 * It is an *exposed* function: call `rw.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function -hence, calling `rw` won't have any effect until the returned function is called.
 */
function rw(
  file: string,
  fn: (raw?: string) => string | void | Promise<string | void>,
  options: IFsReadOptions = {}
): () => Promise<void> {
  return async () => {
    options = Object.assign({ confirm: false, fail: true }, options);

    const cwd = await core.cwd();
    file = absolute({ path: file, cwd });

    const read = await exists(file, { fail: options.fail });

    const raw = read
      ? await fs
          .readFile(file)
          .then(String)
          .catch(rejects)
      : undefined;

    const response = await fn(raw);
    if (response !== undefined) {
      if (options.confirm) {
        const action = await confirm
          .fn(`Write "${path.relative(file, cwd)}"?`, { no: false })
          .then((x) => x !== false);

        if (!action) {
          if (options.fail) throw Error(`Cancelled by user`);
          else return;
        }
      }

      await ensure.fn(path.parse(file).dir);
      await fs.writeFile(file, String(response)).catch(rejects);
    }
  };
}
