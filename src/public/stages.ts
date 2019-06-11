import { TScript, IOfType } from '~/types';
import logger from '~/utils/logger';

export default function stages<T extends IOfType<TScript>>(
  order: Array<keyof T>,
  tasks: T
): TScript {
  return order.map((name, i) => {
    const task = tasks[name];
    return task && [() => logger.info(`[${i}/${order.length}]: ${name}`), task];
  });
}
