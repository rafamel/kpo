import path from 'path';
import fs from 'fs-extra';
import core from '~/core';
import asTag from '~/utils/as-tag';
import { rejects } from 'errorish';
import expose from '~/utils/expose';

// TODO delete rm
export default expose(rm);

function rm(path: string): () => Promise<void>;
function rm(
  literals: TemplateStringsArray,
  ...placeholders: any[]
): () => Promise<void>;
/**
 * String tag; recursively removes `path`, which can be relative to the project's directory.
 * It is an *exposed* function: call `rm.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function -hence, calling `rm` won't have any effect until the returned function is called.
 */
function rm(...args: any[]): () => Promise<void> {
  return async () => {
    let file = asTag(args.shift(), ...args);
    if (!path.isAbsolute(file)) {
      const paths = await core.paths();
      file = path.join(paths.directory, file);
    }

    await fs.remove(file).catch(rejects);
  };
}
