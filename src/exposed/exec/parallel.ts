import core from '~/core';
import { IExecOptions } from '~/types';
import logger from '~/utils/logger';

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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function parallel(
  commands: string | string[],
  options: IParallelOptions = {}
) {
  return async function parallel(args?: string[]): Promise<void> {
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
    } catch (err) {
      if (options.silent) logger.error(err);
      else throw err;
    }
  };
}
