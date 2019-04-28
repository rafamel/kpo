import { IOfType } from '~/types';
import expose from '~/utils/expose';
import rw from './rw';
import { IFsReadOptions } from './types';

export default expose(json);

/**
 * Reads a JSON `file` and passes it as an argument to a callback `fn`. If the callback returns other than `undefined`, **`file` will be overwritten** with the JSON parsed response. `file` can be relative to the project's directory.
 * It is an *exposed* function: call `json.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function -hence, calling `json` won't have any effect until the returned function is called.
 */
function json(
  file: string,
  fn: (
    json?: IOfType<any>
  ) => IOfType<any> | void | Promise<IOfType<any> | void>,
  options: IFsReadOptions = {}
): () => Promise<void> {
  return async () => {
    const _fn = async (raw?: string): Promise<string | undefined> => {
      const json = await fn(raw ? JSON.parse(raw) : undefined);
      return json ? JSON.stringify(json, null, 2) : undefined;
    };

    return rw.fn(file, _fn, options);
  };
}
