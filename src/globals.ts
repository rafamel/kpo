/* eslint-disable @typescript-eslint/explicit-function-return-type */
import inVersionRange from '~/utils/version-range';
import read from 'read-pkg-up';
import cache from '~/utils/cache';
import errors from '~/utils/errors';
import {
  GLOBALS_KEY,
  TGlobal,
  TEnvironmental,
  OWNED_ENV_KEY
} from '~/constants';
import { IOfType } from '~/types';

const locals = {
  globals: {} as { [key in TGlobal]: any },
  environmentals: {} as IOfType<string>
};

export const pkg = cache(
  null,
  (): IOfType<any> => {
    try {
      return read.sync({ cwd: __dirname }).pkg;
    } catch (e) {
      throw new errors.CustomError(`Package couldn't be retrieved`, null, e);
    }
  }
);

/**
 * Used for state preservation for different kpo instances (installations)
 * on the same process. Will only pollute `global` if the process is kpo owned,
 * that is, if `process.env[OWNED_ENV_KEY]` is set.
 */
export function globals<T>(key: TGlobal, initial: T) {
  const vars = process.env[OWNED_ENV_KEY]
    ? (((global as any)[GLOBALS_KEY] ||
        ((global as any)[GLOBALS_KEY] = {})) as { [key in TGlobal]: any })
    : locals.globals;

  if (!vars.version) vars.version = pkg().version;
  else inVersionRange(pkg().version, vars.version);

  return {
    get(): T {
      return vars[key] || (vars[key] = initial);
    },
    set(value: T): void {
      vars[key] = value;
    }
  };
}

/**
 * Used for state preservation for different kpo instances AND children
 * processes. Will only pollute `process.env` if the process is kpo owned,
 * that is, if `process.env[OWNED_ENV_KEY]` is set.
 */
export function environmentals(key: TEnvironmental) {
  const vars = process.env[OWNED_ENV_KEY] ? process.env : locals.environmentals;

  return {
    get(): string | void {
      return vars[key] || undefined;
    },
    set(value?: string): void {
      vars[key] = value || undefined;
    }
  };
}
