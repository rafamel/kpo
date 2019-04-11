import loglevel from 'loglevel';
import { DEFAULT_LOG_LEVEL } from '~/constants';
import { TLogger } from '~/types';

const logger = loglevel.getLogger('_kpo_logger_');
logger.setDefaultLevel(DEFAULT_LOG_LEVEL);

export default logger;
export function setLevel(level: TLogger): void {
  logger.setLevel(level);
}
