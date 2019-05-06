import { options as _options } from '~/core';
import { IScopeOptions } from '~/types';
import { error } from '~/utils/errors';

/**
 * Programmatically sets *kpo* options.
 */
export default function options(opts: IScopeOptions): void {
  try {
    _options.setScope(opts);
  } catch (err) {
    throw error(err);
  }
}
