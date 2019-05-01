import core from '~/core';
import { IOfType, IMultiExecOptions } from '~/types';
import logger from '~/utils/logger';
import { WrappedError } from '~/utils/errors';
import expose from '~/utils/expose';
import join from 'command-join';
import { CONCURRENTLY_PATH } from '~/constants';

/**
 * Options taken by `parallel`
 */
export interface IParallelOptions extends IMultiExecOptions {
  names?: string[];
  colors?: string[];
}

/**
 * Signature for `parallel`. Note that you can call `parallel.env` to pass only environment variables as a second argument. See `parallel`.
 */
export interface IParallel {
  (commands: string | string[], options?: IParallelOptions): (
    args?: string[]
  ) => Promise<void>;
  env(
    commands: string | string[],
    env: IOfType<string>
  ): (args?: string[]) => Promise<void>;
  fn(commands: string | string[], options?: IParallelOptions): Promise<void>;
}

/**
 * Runs `commands` in parallel, with optional environment variables, names and colors assigned to processes, and more. See `IParallel` and `IParallelOptions`.
 * It is an *exposed* function: call `parallel.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function taking additional arguments to be used for all commands -hence, calling `parallel` won't have any effect until the returned function is called.
 */
const parallel = create();
export default parallel;

/** @hidden */
export function create(): IParallel {
  const exposed = expose(function parallel(
    commands: string | string[],
    options: IParallelOptions = {}
  ): (args?: string[]) => Promise<void> {
    return async (args?: string[]) => {
      const argv: string[] = Array.isArray(commands)
        ? commands.map(
            (command) => command + (args && args.length ? ` ${join(args)}` : '')
          )
        : [commands + (args && args.length ? ` ${join(args)}` : '')];

      if (options.names && options.names.length) {
        argv.push('--names', options.names.join(','));
      }
      if (options.colors && options.colors.length) {
        argv.push('-c', options.colors.join(','));
      }
      if (!options.force) {
        argv.push('--kill-others-on-fail');
      }

      try {
        await core.exec(CONCURRENTLY_PATH, argv, true, options);
      } catch (e) {
        const err = new WrappedError(
          'Parallel commands execution failed',
          null,
          e
        );
        if (options.silent) {
          logger.error(err.message);
          logger.debug(err);
        } else {
          throw err;
        }
      }
    };
  });

  return Object.assign(exposed, {
    env(
      commands: string | string[],
      env: IOfType<string>
    ): (args?: string[]) => Promise<void> {
      return exposed(commands, { env });
    }
  });
}
