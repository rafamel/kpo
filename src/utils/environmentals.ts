/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { TEnvironmental, OWNED_ENV_KEY } from '~/constants';
import { IOfType } from '~/types';

const locals = {} as IOfType<string>;

/**
 * Used for state preservation for different kpo instances AND children
 * processes. Will only pollute `process.env` if the process is kpo owned,
 * that is, if `process.env[OWNED_ENV_KEY]` is set.
 */
export default function environmentals(key: TEnvironmental) {
  const vars = process.env[OWNED_ENV_KEY] ? process.env : locals;

  return {
    get(): string | void {
      return vars[key] || undefined;
    },
    set(value?: string): void {
      vars[key] = value || undefined;
    }
  };
}
