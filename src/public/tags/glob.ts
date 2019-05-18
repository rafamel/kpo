import { error } from '~/utils/errors';
import asTag from '~/utils/as-tag';
import _glob from 'glob';

export default glob;

function glob(pattern: string): Promise<string[]>;
function glob(
  literals: TemplateStringsArray,
  ...placeholders: any[]
): Promise<string[]>;
/**
 * String tag; returns a promise resolving with all paths matching a glob
 * @returns Promise<string[]>
 */
async function glob(...args: any[]): Promise<string[]> {
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
}
