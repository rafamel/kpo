/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { TEnvironmental } from '~/constants';

export default {
  get(key: TEnvironmental): string | void {
    return process.env[key] || undefined;
  },
  set(key: TEnvironmental, value?: string): void {
    process.env[key] = value || undefined;
  },
  default(key: TEnvironmental, value: string): string {
    return this.get(key) || this.set(key, value) || value;
  }
};
