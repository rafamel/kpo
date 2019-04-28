import path from 'path';
import fs from 'fs-extra';
import core from '~/core';
import asTag from '~/utils/as-tag';
import { rejects } from 'errorish';
import expose from '~/utils/expose';

export default expose(ensure);

function ensure(directory: string): () => Promise<void>;
function ensure(
  literals: TemplateStringsArray,
  ...placeholders: any[]
): () => Promise<void>;
/**
 * String tag; ensures `directory` exists -if it doesn't it creates it. `directory` can be relative to the project's directory.
 * It is an *exposed* function: call `ensure.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function -hence, calling `ensure` won't have any effect until the returned function is called.
 */
function ensure(...args: any[]): () => Promise<void> {
  return async () => {
    let directory = asTag(args.shift(), ...args);
    if (!path.isAbsolute(directory)) {
      const paths = await core.paths();
      directory = path.join(paths.directory, directory);
    }

    await fs.ensureDir(directory).catch(rejects);
  };
}
