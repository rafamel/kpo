import loglevel from 'loglevel';
import chalk, { Chalk } from 'chalk';
import { DEFAULT_LOG_LEVEL } from '~/constants';
import { TLogger } from '~/types';

const APP_NAME = 'kpo';
const logger = loglevel.getLogger(`_${APP_NAME}_logger_`);
logger.setDefaultLevel(DEFAULT_LOG_LEVEL);

function setLevel(level: TLogger): void {
  logger.setLevel(level);
}

const colors: { [key in TLogger]?: Chalk } = {
  trace: chalk.magenta,
  debug: chalk.cyan,
  warn: chalk.bold.yellow,
  error: chalk.bold.red
};

function prefix(level: TLogger): string {
  const color = colors[level];
  const name = level.toUpperCase();
  // Don't log app name or info prefix when log level is 'info', 'warn', 'error'
  if (logger.getLevel() >= 2) {
    return level === 'info' ? '' : color ? color(`${name}: `) : `${name}: `;
  }
  return APP_NAME + ' ' + (color ? color(`${name}: `) : `${name}: `);
}

const factory = logger.methodFactory;
logger.methodFactory = (...args) => (...inner: any[]) => {
  factory.call(loglevel, ...args)(
    prefix(args[0].toLowerCase() as TLogger) + inner[0],
    ...inner.slice(1)
  );
};

export { logger as default, setLevel };
