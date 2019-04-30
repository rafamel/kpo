import core from '~/core';
import { IExecOptions, IOfType } from '~/types';
import logger from '~/utils/logger';
import expose from '~/utils/expose';

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
  (commands: string | string[], options?: ISeriesOptions): (
    args?: string[]
  ) => Promise<void>;
  env(
    commands: string | string[],
    env: IOfType<string>
  ): (args?: string[]) => Promise<void>;
  fn(commands: string | string[], options?: ISeriesOptions): Promise<void>;
}

/**
 * Runs `commands` in series, with optional environment variables and other options. See `ISeries` and `ISeriesOptions`.
 * It is an *exposed* function: call `series.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function taking additional arguments to be used for all commands -hence, calling `series` won't have any effect until the returned function is called.
 */
const series: ISeries = (() => {
  const exposed = expose(function parallel(
    commands: string | string[],
    options: ISeriesOptions = {}
  ): (args?: string[]) => Promise<void> {
    return async (args?: string[]) => {
      if (!Array.isArray(commands)) commands = [commands];

      let err: Error | null = null;
      for (let command of commands) {
        try {
          if (!command) throw Error(`No command passed for series`);
          await core.exec(command, args || [], false, options);
        } catch (e) {
          err = e;
          if (options.force || options.silent) logger.error(e.message);
          if (!options.force) break;
        }
      }
      if (err && !options.silent) throw err;
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
})();

export default series;
