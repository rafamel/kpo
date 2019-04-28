import path from 'path';
import core from '~/core';
import asTag from '~/utils/as-tag';
import { exists as _exists } from '~/utils/file';
import expose from '~/utils/expose';

export default expose(exists);

function exists(path: string): () => Promise<void>;
function exists(
  literals: TemplateStringsArray,
  ...placeholders: any[]
): () => Promise<void>;
/**
 * String tag; verifies `path` exists and throws if it doesn't. `path` can be either a file or a directory, and be relative to the project's directory.
 * It is an *exposed* function: call `exists.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function -hence, calling `exists` won't have any effect until the returned function is called.
 */
function exists(...args: any[]): () => Promise<void> {
  return async () => {
    let file = asTag(args.shift(), ...args);
    if (!path.isAbsolute(file)) {
      const paths = await core.paths();
      file = path.join(paths.directory, file);
    }
    await _exists(file, { fail: true });
  };
}
