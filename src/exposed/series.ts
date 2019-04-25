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

export default function series(
  commands: string | string[],
  options: ISeriesOptions = {}
) {
  return async function series(args?: string[]): Promise<void> {
    if (!Array.isArray(commands)) commands = [commands];

    let err: Error | null = null;
    for (let command of commands) {
      try {
        await core.exec(command, args || [], options);
      } catch (e) {
        err = e;
        if (!options.force) break;
      }
    }
    if (err) {
      if (options.silent) logger.debug(err);
      else throw err;
    }
  };
}
