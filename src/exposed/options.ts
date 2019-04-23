import state from '~/state';
import { IScopeOptions } from '~/types';

export default function options(opts: IScopeOptions): void {
  return state.scope(opts);
}
