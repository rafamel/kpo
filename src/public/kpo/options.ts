import { options as _options } from '~/core';
import { IScopeOptions } from '~/types';
import errors from '~/utils/errors';

/**
 * Programmatically sets *kpo* options.
 */
export default function options(opts: IScopeOptions): void {
  return errors.wrap.throws(() => _options.setScope(opts));
}
