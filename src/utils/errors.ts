import { scope, Errorish } from 'errorish';

// Error changes might constitute major version changes even if internal,
// as they're overwritten for different kpo instances on core load

class CustomError<T> extends Errorish<T> {}

class OpenError<T> extends CustomError<T> {
  public get name(): string {
    return 'OpenError';
  }
}

class WrappedError<T> extends CustomError<T> {
  public get name(): string {
    return 'WrappedError';
  }
}

const open = scope.set('_kpo_open_', {
  Error: CustomError,
  Errorish: OpenError
});

const wrap = scope.set('_kpo_wrap_', {
  Error: CustomError,
  Errorish: WrappedError
});

export default {
  CustomError,
  OpenError,
  WrappedError,
  open,
  wrap
};
