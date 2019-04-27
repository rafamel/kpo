import path from 'path';
import fs from 'fs-extra';
import core from '~/core';
import asTag from '~/utils/as-tag';
import { TScript } from '~/types';
import { rejects } from 'errorish';
import { wrap } from '~/utils/errors';

export default rm;

function rm(path: string): TScript;
function rm(literals: TemplateStringsArray, ...placeholders: any[]): TScript;
/**
 * String tag; recursively removes `path`, which can be relative to the project's directory.
 * @returns A `TScript`, as a function, that won't be executed until called by `kpo` -hence, calling `rm` won't have any effect until the returned function is called.
 */
function rm(...args: any[]): TScript {
  return (): Promise<void> => {
    return wrap.throws(async () => {
      let file = asTag(args.shift(), ...args);
      if (!path.isAbsolute(file)) {
        const paths = await core.paths();
        file = path.join(paths.directory, file);
      }

      await fs.remove(file).catch(rejects);
    });
  };
}
