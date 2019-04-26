import { TScript } from '~/types';
import core from '~/core';
import asTag from '~/utils/as-tag';
import logger from '~/utils/logger';

export default silent;

function silent(command: string): TScript;
function silent(
  literals: TemplateStringsArray,
  ...placeholders: any[]
): TScript;
/**
 * String tag; executes a command that will always exit with code 0.
 * @returns A `TScript`, as a function, that won't be executed until called by `kpo` -hence, calling `silent` won't have any effect until the returned function is called.
 */
function silent(...args: any[]): TScript {
  return async function silent(argv): Promise<void> {
    const command = asTag(args.shift(), ...args);
    try {
      await core.exec(command, argv, false);
    } catch (err) {
      logger.error(err);
    }
  };
}
