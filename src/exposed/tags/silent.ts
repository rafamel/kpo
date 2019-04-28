import core from '~/core';
import asTag from '~/utils/as-tag';
import logger from '~/utils/logger';
import expose from '~/utils/expose';

export default expose(silent);

function silent(command: string): (args?: string[]) => Promise<void>;
function silent(
  literals: TemplateStringsArray,
  ...placeholders: any[]
): (args?: string[]) => Promise<void>;
/**
 * String tag; executes a command that will always exit with code 0.
 * It is an *exposed* function: call `silent.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function -hence, calling `silent` won't have any effect until the returned function is called.
 */
function silent(...args: any[]): (args?: string[]) => Promise<void> {
  return async function silent(argv) {
    try {
      const command = asTag(args.shift(), ...args);
      await core.exec(command, argv || [], false);
    } catch (err) {
      logger.error(err);
    }
  };
}
