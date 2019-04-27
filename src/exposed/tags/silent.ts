import { TScriptAsyncFn } from '~/types';
import core from '~/core';
import asTag from '~/utils/as-tag';
import logger from '~/utils/logger';

export default silent;

function silent(command: string): TScriptAsyncFn;
function silent(
  literals: TemplateStringsArray,
  ...placeholders: any[]
): TScriptAsyncFn;
/**
 * String tag; executes a command that will always exit with code 0.
 * @returns An asynchronous function, as a `TScriptAsyncFn`, that won't be executed until called by `kpo` -hence, calling `silent` won't have any effect until the returned function is called.
 */
function silent(...args: any[]): TScriptAsyncFn {
  return async function silent(argv?: string[]): Promise<void> {
    try {
      const command = asTag(args.shift(), ...args);
      await core.exec(command, argv || [], false);
    } catch (err) {
      logger.error(err);
    }
  };
}
