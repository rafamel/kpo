import { IOfType } from '~/types';

export default function wrapCore<
  T extends IOfType<(...args: any[]) => Promise<any>>
>(before: Array<() => Promise<void>>, core: T): T {
  return Object.entries(core).reduce((acc: Partial<T>, [key, value]) => {
    acc[key] = async (...args: any[]) => {
      for (let fn of before) {
        await fn();
      }
      return value(...args);
    };
    return acc;
  }, {}) as T;
}
