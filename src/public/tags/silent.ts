import core from '~/core';
import asTag from '~/utils/as-tag';
import logger from '~/utils/logger';
import expose, { TExposedOverload } from '~/utils/expose';
import { ensure } from 'errorish';

export default expose(silent) as TExposedOverload<
  typeof silent,
  [string] | [TemplateStringsArray, ...any[]]
>;

function silent(command: string): (args?: string[]) => Promise<void>;
function silent(
  literals: TemplateStringsArray,
  ...placeholders: any[]
): (args?: string[]) => Promise<void>;
/**
 * String tag; executes a command that will always exit with code *0.*
 * It is an *exposed* function: use `silent.fn` as tag instead in order to execute on call.
 * @returns An asynchronous function -hence, calling `silent` won't have any effect until the returned function is called.
 */
function silent(...args: any[]): (args?: string[]) => Promise<void> {
  return async function silent(argv) {
    try {
      const command = asTag(args.shift(), ...args);
      await core.exec(command, argv || [], false);
    } catch (e) {
      const err = ensure(e);
      logger.error(err.message);
      logger.debug(err);
    }
  };
}
