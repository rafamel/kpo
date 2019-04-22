import state from '~/state';
import { IOptions } from '~/types';

export default function options(opts: IOptions): void {
  return state.scope(opts);
}
