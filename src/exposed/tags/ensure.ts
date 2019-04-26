import path from 'path';
import fs from 'fs-extra';
import core from '~/core';
import { TScript } from '~/types';
import asTag from '~/utils/as-tag';
import { rejects } from 'errorish';

export default ensure;

function ensure(directory: string): TScript;
function ensure(
  literals: TemplateStringsArray,
  ...placeholders: any[]
): TScript;
/**
 * String tag; ensures `directory` exists -if it doesn't it creates it. `directory` can be relative to the project's directory.
 * @returns A `TScript`, as a function, that won't be executed until called by `kpo` -hence, calling `ensure` won't have any effect until the returned function is called.
 */
function ensure(...args: any[]): TScript {
  return async function ensure(): Promise<void> {
    let directory = asTag(args.shift(), ...args);
    if (!path.isAbsolute(directory)) {
      const paths = await core.paths();
      directory = path.join(paths.directory, directory);
    }

    await fs.ensureDir(directory).catch(rejects);
  };
}
