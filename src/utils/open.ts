import { scope, Errorish } from 'errorish';

export class OpenError<T> extends Errorish<T> {}

export default scope.set('_kpo_open_', {
  Error: OpenError,
  Errorish: OpenError
});
