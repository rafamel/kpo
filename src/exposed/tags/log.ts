import asTag from '~/utils/as-tag';
import expose, { TExposedOverload } from '~/utils/expose';

export default expose(log) as TExposedOverload<
  typeof log,
  [string] | [TemplateStringsArray, ...any[]]
>;

function log(message: string): () => void;
function log(
  literals: TemplateStringsArray,
  ...placeholders: any[]
): () => void;
/**
 * String tag; logs a string on `stdout`.
 * It is an *exposed* function: use `log.fn` as tag instead in order to execute on call.
 * @returns A function -hence, calling `log` won't have any effect until the returned function is called.
 */
function log(...args: any[]): () => void {
  return () => {
    const message = asTag(args.shift(), ...args);
    // eslint-disable-next-line no-console
    console.log(message);
  };
}
