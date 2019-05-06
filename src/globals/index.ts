import inVersionRange from './version-range';
import _ from './globals';
import { TGlobal } from '~/constants';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function globals<T>(key: TGlobal, initial: T) {
  inVersionRange();

  return {
    get(): T {
      return _[key] || (_[key] = initial);
    },
    set(value: T): void {
      _[key] = value;
    }
  };
}
