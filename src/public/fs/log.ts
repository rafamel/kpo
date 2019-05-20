import logger from '~/utils/logger';
import { IFsReadOptions } from './types';

export default function log(
  options: IFsReadOptions,
  level: 'trace' | 'debug' | 'info' | 'warn' | 'error'
): (...args: any[]) => void {
  return (...args) => {
    if (!options.hasOwnProperty('logger')) return logger[level](...args);
    if (options.logger) logger[level](...args);
  };
}
