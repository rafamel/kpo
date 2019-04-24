import hash from 'object-hash';
import { IOfType } from '~/types';

// TODO modularize
export default function memoize<T extends Function>(fn: T): T {
  const cache: IOfType<any> = {};

  return function(...args: any[]) {
    const key = hash(args);
    if (cache.hasOwnProperty(key)) return cache[key];

    return (cache[key] = fn(...args));
  } as any;
}
