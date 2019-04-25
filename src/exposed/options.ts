import _options from '~/options';
import { IScopeOptions } from '~/types';

export default function options(opts: IScopeOptions): void {
  return _options.setScope(opts);
}
