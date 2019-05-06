import { IOfType } from '~/types';
import { lazy } from 'promist';

export default function wrap<
  T,
  C extends IOfType<(...args: any[]) => Promise<any>>
>(initialize: () => Promise<T>, getCore: (value: Promise<T>) => C): () => C {
  return () => {
    let resolved = false;
    const promise = lazy((resolve, reject) => {
      return initialize()
        .then((value) => (resolved = true) && resolve(value))
        .catch((reason) => (resolved = true) && reject(reason));
    });

    return Object.entries(getCore(promise)).reduce(
      (acc: Partial<C>, [key, value]) => {
        acc[key] = async (...args: any): Promise<any> => {
          // ensure promise is awaited for for all, even if not explicitly
          if (!resolved) await promise;
          return value(...args);
        };
        return acc;
      },
      {}
    ) as C;
  };
}
