import { IOfType } from '~/types';

export default function cache<T>(getId: () => string, fn: () => T): () => T {
  const store: IOfType<any> = {};

  return function() {
    const key = getId();
    if (store.hasOwnProperty(key)) return store[key];

    return (store[key] = fn());
  } as any;
}
