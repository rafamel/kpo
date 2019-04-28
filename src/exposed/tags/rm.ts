import asTag from '~/utils/as-tag';
import expose from '~/utils/expose';
import remove from '../file/remove';

export default expose(rm);

function rm(path: string): () => Promise<void>;
function rm(
  literals: TemplateStringsArray,
  ...placeholders: any[]
): () => Promise<void>;
/**
 * String tag; recursively removes `path`, which can be relative to the project's directory. It won't ask for user confirmation, nor fail if `path` doesn't exist.
 * It is an *exposed* function: call `rm.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function -hence, calling `rm` won't have any effect until the returned function is called.
 */
function rm(...args: any[]): () => Promise<void> {
  return async () => {
    let file = asTag(args.shift(), ...args);
    return remove.fn(file);
  };
}
