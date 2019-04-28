import path from 'path';
import fs from 'fs-extra';
import { exists } from '~/utils/file';
import core from '~/core';
import { IOfType } from '~/types';
import { rejects } from 'errorish';
import expose from '~/utils/expose';

// TODO add confirm
export default expose(json);
/**
 * Reads a JSON `file` and passes it as an argument to a callback `fn`. If the callback returns an object, **`file` will be overwritten** with its contents. `file` can be relative to the project's directory.
 * It is an *exposed* function: call `json.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function -hence, calling `json` won't have any effect until the returned function is called.
 */
function json(
  file: string,
  fn: (json: IOfType<any>) => IOfType<any> | void | Promise<IOfType<any> | void>
): () => Promise<void> {
  return async () => {
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
  };
}
