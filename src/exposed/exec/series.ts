import core from '~/core';
import { IExecOptions, IOfType, TScriptAsyncFn } from '~/types';
import logger from '~/utils/logger';
import { wrap } from '~/utils/errors';

export interface ISeriesOptions extends IExecOptions {
  /**
   * If `true`, it will never throw.
   */
  silent?: boolean;
  /**
   * If `true`, it will continue executing commands in the series even if some of them fail.
   */
  force?: boolean;
}

/**
 * Signature for `series`. Note that you can call `series.env` to pass only environment variables as a second argument. See `series`.
 */
export interface ISeries {
  (commands: string | string[], options?: ISeriesOptions): TScriptAsyncFn;
  env(commands: string | string[], env: IOfType<string>): TScriptAsyncFn;
}

/**
 * Runs `commands` in series, with optional environment variables, names and colors assigned to processes, and more. See `ISeries` and `ISeriesOptions`.
 * @returns An asynchronous function, as a `TScriptAsyncFn`, that won't be executed until called by `kpo` -hence, calling `series` won't have any effect until the returned function is called.
 */
const series: ISeries = function series(commands, options = {}) {
  return (args?: string[]): Promise<void> => {
    return wrap.throws(async () => {
      if (!Array.isArray(commands)) commands = [commands];

      let err: Error | null = null;
      for (let command of commands) {
        try {
          if (!command) throw Error(`No command passed for series`);
          await core.exec(command, args || [], false, options);
        } catch (e) {
          err = e;
          if (options.force || options.silent) logger.error(err);
          if (!options.force) break;
        }
      }
      if (err && !options.silent) throw err;
    });
  };
};

series.env = function env(commands, env) {
  return series(commands, { env });
};

export default series;
