import path from 'path';
import core from '~/core';
import { exists as _exists } from '~/utils/file';

/**
 * Verifies `file` exists and throws if it doesn't. `file` can be either a file or a directory, and be relative to the project's directory.
 * @returns A `TScript`, as a function, that won't be executed until called by `kpo` -hence, calling `exists` won't have any effect until the returned function is called.
 */
export default function exists(file: string) {
  return async function exists(): Promise<void> {
    if (!path.isAbsolute(file)) {
      const paths = await core.paths();
      file = path.join(paths.directory, file);
    }
    await _exists(file, { fail: true });
  };
}
