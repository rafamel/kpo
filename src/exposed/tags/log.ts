import { TScriptSyncFn } from '~/types';
import asTag from '~/utils/as-tag';
import { wrap } from '~/utils/errors';

export default log;

function log(message: string): TScriptSyncFn;
function log(
  literals: TemplateStringsArray,
  ...placeholders: any[]
): TScriptSyncFn;
/**
 * String tag; logs a string on `stdout`.
 * @returns An function, as a `TScriptSyncFn`, that won't be executed until called by `kpo` -hence, calling `log` won't have any effect until the returned function is called.
 */
function log(...args: any[]): TScriptSyncFn {
  return (): void => {
    return wrap.throws(() => {
      const message = asTag(args.shift(), ...args);
      // eslint-disable-next-line no-console
      console.log(message);
    });
  };
}
