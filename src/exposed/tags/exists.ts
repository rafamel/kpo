import path from 'path';
import core from '~/core';
import asTag from '~/utils/as-tag';
import { exists as _exists } from '~/utils/file';
import { TScript } from '~/types';

export default exists;

function exists(path: string): TScript;
function exists(
  literals: TemplateStringsArray,
  ...placeholders: any[]
): TScript;
/**
 * String tag; verifies `path` exists and throws if it doesn't. `path` can be either a file or a directory, and be relative to the project's directory.
 * @returns A `TScript`, as a function, that won't be executed until called by `kpo` -hence, calling `exists` won't have any effect until the returned function is called.
 */
function exists(...args: any[]): TScript {
  return async function exists(): Promise<void> {
    let file = asTag(args.shift(), ...args);
    if (!path.isAbsolute(file)) {
      const paths = await core.paths();
      file = path.join(paths.directory, file);
    }
    await _exists(file, { fail: true });
  };
}
