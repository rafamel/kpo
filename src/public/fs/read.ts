import fs from 'fs-extra';
import { exists, absolute } from '~/utils/file';
import expose from '~/utils/expose';
import { IFsReadOptions } from './types';
import { TScript } from '~/types';

export default expose(read);

/**
 * Reads a `file` and passes it as an argument to a callback `fn`, which can return a `TScript`.
 * It is an *exposed* function: call `read.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function -hence, calling `read` won't have any effect until the returned function is called.
 */
function read(
  file: string,
  fn: (raw?: string) => TScript,
  options: IFsReadOptions = {}
): () => Promise<TScript> {
  return async () => {
    const cwd = process.cwd();
    file = absolute({ path: file, cwd });
    const doesExist = await exists(file, { fail: options.fail });
    const raw = doesExist ? await fs.readFile(file).then(String) : undefined;

    return fn(raw);
  };
}
