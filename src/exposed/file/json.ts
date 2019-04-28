import path from 'path';
import fs from 'fs-extra';
import { exists } from '~/utils/file';
import core from '~/core';
import { IOfType, TScriptAsyncFn } from '~/types';
import { rejects } from 'errorish';
import { wrap } from '~/utils/errors';

/**
 * Reads a JSON `file` and passes it as an argument to a callback `fn`. If the callback returns an object, **`file` will be overwritten** with its contents. `file` can be relative to the project's directory.
 * @returns An asynchronous function, as a `TScriptAsyncFn`, that won't be executed until called by `kpo` -hence, calling `json` won't have any effect until the returned function is called.
 */
export default function json(
  file: string,
  fn: (json: IOfType<any>) => IOfType<any> | void | Promise<IOfType<any> | void>
): TScriptAsyncFn {
  return (): Promise<void> => {
    return wrap.throws(async () => {
      if (!path.isAbsolute(file)) {
        const paths = await core.paths();
        file = path.join(paths.directory, file);
      }

      await exists(file, { fail: true });
      const json = await fs.readJSON(file).catch(rejects);
      const response = await fn(json);
      if (response) {
        await fs
          .writeFile(file, JSON.stringify(response, null, 2))
          .catch(rejects);
      }
    });
  };
}
