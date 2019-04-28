import fs from 'fs-extra';
import core from '~/core';
import asTag from '~/utils/as-tag';
import { rejects } from 'errorish';
import expose from '~/utils/expose';
import { absolute } from '~/utils/file';

export default expose(ensure);

function ensure(directory: string): () => Promise<void>;
function ensure(
  literals: TemplateStringsArray,
  ...placeholders: any[]
): () => Promise<void>;
/**
 * String tag; ensures `directory` exists -if it doesn't it creates it. `directory` can be relative to the project's directory.
 * It is an *exposed* function: use `ensure.fn` as tag instead in order to execute on call.
 * @returns An asynchronous function -hence, calling `ensure` won't have any effect until the returned function is called.
 */
function ensure(...args: any[]): () => Promise<void> {
  return async () => {
    // TODO fix core.paths() -> core.cwd()
    const paths = await core.paths();
    const directory = absolute({
      path: asTag(args.shift(), ...args),
      cwd: paths.directory
    });

    await fs.ensureDir(directory).catch(rejects);
  };
}
