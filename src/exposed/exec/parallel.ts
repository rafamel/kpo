import core from '~/core';
import { IExecOptions, TScript, IOfType } from '~/types';
import logger from '~/utils/logger';
import { wrap } from '~/utils/errors';

export interface IParallelOptions extends IExecOptions {
  names?: string[];
  colors?: string[];
  /**
   * If `true`, it will fail early, killing all other processes if any of them fails.
   */
  early?: boolean;
  /**
   * If `true`, it will never throw.
   */
  silent?: boolean;
}

/**
 * Signature for `parallel`. Note that you can call `parallel.env` to pass only environment variables as a second argument. See `parallel`.
 */
export interface IParallel {
  (commands: string | string[], options?: IParallelOptions): TScript;
  env(commands: string | string[], env: IOfType<string>): TScript;
}

/**
 * Runs `commands` in parallel, with optional environment variables, names and colors assigned to processes, and more. See `IParallel` and `IParallelOptions`.
 * @returns A `TScript`, as a function, that won't be executed until called by `kpo` -hence, calling `parallel` won't have any effect until the returned function is called.
 */
const parallel: IParallel = function parallel(commands, options = {}) {
  return (args?: string[]): Promise<void> => {
    return wrap.throws(async () => {
      const argv: string[] = Array.isArray(commands)
        ? commands.concat()
        : [commands];

      if (options.names && options.names.length) {
        argv.push('--names', options.names.join(','));
      }
      if (options.colors && options.colors.length) {
        argv.push('-c', options.colors.join(','));
      }
      if (options.early) {
        argv.push('--kill-others-on-fail');
      }

      try {
        await core.exec(
          require.resolve('concurrently/bin/concurrently'),
          args ? argv.concat(args) : argv,
          true,
          options
        );
      } catch (e) {
        const err = wrap.ensure(e, {
          allow: [],
          message: 'Parallel commands execution failed'
        });
        if (options.silent) logger.error(err);
        else throw err;
      }
    });
  };
};

parallel.env = function env(
  commands: string | string[],
  env: IOfType<string>
): TScript {
  return parallel(commands, { env });
};

export default parallel;
