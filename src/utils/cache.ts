import { IOfType } from '~/types';

export default function cache<T extends Function>(
  getId: () => string,
  fn: T
): T {
  const store: IOfType<any> = {};

  return function(...args: any[]) {
    const key = getId();
    if (store.hasOwnProperty(key)) return store[key];

    return (store[key] = fn(...args));
  } as any;
}
