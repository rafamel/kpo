import { options as _options } from '~/core';
import { IScopeOptions } from '~/types';

export default function options(opts: IScopeOptions): void {
  return _options.setScope(opts);
}
