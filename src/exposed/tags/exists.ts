import core from '~/core';
import asTag from '~/utils/as-tag';
import { exists as _exists, absolute } from '~/utils/file';
import expose, { TExposedOverload } from '~/utils/expose';

export default expose(exists) as TExposedOverload<
  typeof exists,
  [string] | [TemplateStringsArray, ...any[]]
>;

function exists(path: string): () => Promise<void>;
function exists(
  literals: TemplateStringsArray,
  ...placeholders: any[]
): () => Promise<void>;
/**
 * String tag; verifies `path` exists and throws if it doesn't. `path` can be either a file or a directory, and be relative to the project's directory.
 * It is an *exposed* function: use `exists.fn` as tag instead in order to execute on call.
 * @returns An asynchronous function -hence, calling `exists` won't have any effect until the returned function is called.
 */
function exists(...args: any[]): () => Promise<void> {
  return async () => {
    const file = absolute({
      path: asTag(args.shift(), ...args),
      cwd: await core.cwd()
    });

    await _exists(file, { fail: true });
  };
}
