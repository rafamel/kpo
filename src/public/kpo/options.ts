import { options as _options } from '~/core';
import { IScopeOptions } from '~/types';
import { wrap } from '~/utils/errors';

/**
 * Programmatically sets *kpo* options.
 */
export default function options(opts: IScopeOptions): void {
  return wrap.throws(() => _options.setScope(opts));
}
