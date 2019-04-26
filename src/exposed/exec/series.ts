import core from '~/core';
import { IExecOptions, TScript, IOfType } from '~/types';
import logger from '~/utils/logger';

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
  (commands: string | string[], options?: ISeriesOptions): TScript;
  env(commands: string | string[], env: IOfType<string>): TScript;
}

/**
 * Runs `commands` in series, with optional environment variables, names and colors assigned to processes, and more. See `ISeries` and `ISeriesOptions`.
 * @returns A `TScript`, as a function, that won't be executed until called by `kpo` -hence, calling `series` won't have any effect until the returned function is called.
 */
const series: ISeries = function series(commands, options = {}) {
  return async function series(args?: string[]): Promise<void> {
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
  };
};

series.env = function env(
  commands: string | string[],
  env: IOfType<string>
): TScript {
  return series(commands, { env });
};

export default series;
