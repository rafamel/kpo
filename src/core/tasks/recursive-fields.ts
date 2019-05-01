import { IOfType } from '~/types';
import purePath from './pure-path';

export default function recursiveFields(obj: IOfType<any>): string[] {
  return trunk(obj, '').map((path) => purePath(path.slice(1)));
}

export function trunk(obj: IOfType<any>, path: string): string[] {
  if (
    typeof obj !== 'object' ||
    obj === null ||
    obj instanceof Error ||
    Array.isArray(obj)
  ) {
    return [path];
  }

  return Object.entries(obj).reduce((acc: string[], [key, value]) => {
    if (key[0] === '_') return acc;
    acc = acc.concat(trunk(value, `${path}.${key}`));
    return acc;
  }, []);
}
