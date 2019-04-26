import core from '~/core';
import { IExecOptions } from '~/types';
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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function series(
  commands: string | string[],
  options: ISeriesOptions = {}
) {
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
}
