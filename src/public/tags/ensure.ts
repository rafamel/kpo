import asTag from '~/utils/as-tag';
import expose, { TExposedOverload } from '~/utils/expose';
import mkdir from '../fs/mkdir';

export default expose(ensure) as TExposedOverload<
  typeof ensure,
  [string] | [TemplateStringsArray, ...any[]]
>;

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
    const path = asTag(args.shift(), ...args);
    return mkdir.fn(path, { confirm: false, fail: false });
  };
}
