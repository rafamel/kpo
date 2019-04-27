import path from 'path';
import core from '~/core';
import asTag from '~/utils/as-tag';
import { exists as _exists } from '~/utils/file';
import { TScriptAsyncFn } from '~/types';
import { wrap } from '~/utils/errors';

export default exists;

function exists(path: string): TScriptAsyncFn;
function exists(
  literals: TemplateStringsArray,
  ...placeholders: any[]
): TScriptAsyncFn;
/**
 * String tag; verifies `path` exists and throws if it doesn't. `path` can be either a file or a directory, and be relative to the project's directory.
 * @returns An asynchronous function, as a `TScriptAsyncFn`, that won't be executed until called by `kpo` -hence, calling `exists` won't have any effect until the returned function is called.
 */
function exists(...args: any[]): TScriptAsyncFn {
  return (): Promise<void> => {
    return wrap.throws(async () => {
      let file = asTag(args.shift(), ...args);
      if (!path.isAbsolute(file)) {
        const paths = await core.paths();
        file = path.join(paths.directory, file);
      }
      await _exists(file, { fail: true });
    });
  };
}
