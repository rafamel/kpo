import asTag from '~/utils/as-tag';
import expose, { TExposedOverload } from '~/utils/expose';
import _glob from 'glob';
import { error } from '~/utils/errors';

export default expose(glob) as TExposedOverload<
  typeof glob,
  [string] | [TemplateStringsArray, ...any[]]
>;

function glob(pattern: string): () => Promise<string[]>;
function glob(
  literals: TemplateStringsArray,
  ...placeholders: any[]
): () => Promise<string[]>;

/**
 * String tag; returns a promise resolving with all paths matching a glob
 * It is an *exposed* function: use `glob.fn` as tag instead in order to execute on call.
 * @returns A function -hence, calling `glob` won't have any effect until the returned function is called.
 */
function glob(...args: any[]): () => Promise<string[]> {
  return async () => {
    try {
      const pattern = asTag(args.shift(), ...args);
      return await new Promise((resolve: (arg: string[]) => void, reject) =>
        _glob(pattern, { cwd: process.cwd() }, (err, matches) =>
          err ? reject(err) : resolve(matches)
        )
      );
    } catch (err) {
      throw error(err);
    }
  };
}
