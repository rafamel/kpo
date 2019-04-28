import asTag from '~/utils/as-tag';
import expose from '~/utils/expose';

export default expose(log);

function log(message: string): () => void;
function log(
  literals: TemplateStringsArray,
  ...placeholders: any[]
): () => void;
/**
 * String tag; logs a string on `stdout`.
 * It is an *exposed* function: call `log.fn()`, which takes the same arguments, in order to execute on call.
 * @returns A function -hence, calling `log` won't have any effect until the returned function is called.
 */
function log(...args: any[]): () => void {
  return () => {
    const message = asTag(args.shift(), ...args);
    // eslint-disable-next-line no-console
    console.log(message);
  };
}
