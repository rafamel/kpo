import { scope, Errorish } from 'errorish';

export class CustomError<T> extends Errorish<T> {}

export class OpenError<T> extends CustomError<T> {}

export class WrappedError<T> extends CustomError<T> {}

export const open = scope.set('_kpo_open_', {
  Error: CustomError,
  Errorish: OpenError
});

export const wrap = scope.set('_kpo_wrap_', {
  allow: [],
  Error: CustomError,
  Errorish: WrappedError
});
