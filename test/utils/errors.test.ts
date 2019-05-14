import {
  KpoError,
  OpenError,
  SilentError,
  isKpoError,
  isOpenError,
  isSilentError,
  open,
  error
} from '~/utils/errors';

describe(`KpoError`, () => {
  describe(`class`, () => {
    test(`creates w/ message`, () => {
      const err = new KpoError('Foo', Error('Bar'));
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('Foo');
    });
    test(`creates w/ default message`, () => {
      expect(new KpoError().message).toBe('An error occurred');
    });
    test(`creates w/ source error message`, () => {
      expect(new KpoError(null, new Error('Foo')).message).toBe('Foo');
    });
    test(`creates w/ source message key`, () => {
      expect(new KpoError(null, { message: 'Foo' }).message).toBe('Foo');
    });
    test(`creates w/ source string`, () => {
      expect(new KpoError(null, 'Foo').message).toBe('Foo');
    });
    test(`has source`, () => {
      expect(new KpoError().source).toBeUndefined();

      const source = {};
      expect(new KpoError(null, source).source).toBe(source);
    });
    test(`has data`, () => {
      expect(new KpoError().data).toEqual({});
      expect(new KpoError(null, null, { foo: 'bar' }).data).toEqual({
        foo: 'bar'
      });
    });
    test(`root is self if source is not Error`, () => {
      const err = new KpoError(null, {});
      expect(err.root).toBe(err);
    });
    test(`root is source if Error`, () => {
      const err = Error();
      expect(new KpoError(null, err).root).toBe(err);
    });
    test(`root is obtained recursively`, () => {
      const err = Error();
      expect(new KpoError(null, new KpoError(null, err)).root).toBe(err);
    });
    test(`set`, () => {
      expect(new KpoError().set({ bar: 'baz' }).data).toEqual({ bar: 'baz' });
      expect(
        new KpoError(null, null, { foo: 'bar' }).set({ bar: 'baz' }).data
      ).toEqual({ bar: 'baz' });
    });
    test(`assign`, () => {
      expect(new KpoError().assign({ bar: 'baz' }).data).toEqual({
        bar: 'baz'
      });
      expect(
        new KpoError(null, null, { foo: 'bar' }).assign({ bar: 'baz' }).data
      ).toEqual({ foo: 'bar', bar: 'baz' });
    });
    test(`name`, () => {
      expect(new KpoError().name).toBe('CustomError');
    });
    test(`is KpoError`, () => {
      expect(KpoError.isKpoError).toBe(true);
    });
  });
  describe(`error`, () => {
    test(`creates`, () => {
      expect(error()).toBeInstanceOf(KpoError);

      const err = Error();
      expect(error(err)).toBeInstanceOf(KpoError);
      expect(error(err).source).toBe(err);
    });
    test(`returns source`, () => {
      let err: Error;
      err = new KpoError();
      expect(error(err)).toBe(err);
      err = new OpenError();
      expect(error(err)).toBe(err);
      err = new SilentError();
      expect(error(err)).toBe(err);
    });
  });
  describe(`isKpoError`, () => {
    test(`true`, () => {
      class Err extends Error {
        public static isKpoError = true;
      }
      expect(isKpoError(new Err())).toBe(true);
      expect(isKpoError(new KpoError())).toBe(true);
      expect(isKpoError(new OpenError())).toBe(true);
      expect(isKpoError(new SilentError())).toBe(true);
    });
    test(`false`, () => {
      expect(isKpoError(Error())).toBe(false);
      expect(isKpoError({})).toBe(false);
      expect(isKpoError(null)).toBe(false);
      expect(isKpoError({ isKpoError: true })).toBe(false);
    });
  });
});

describe(`OpenError`, () => {
  describe(`class`, () => {
    test(`is KpoError`, () => {
      expect(new OpenError()).toBeInstanceOf(KpoError);
      expect(OpenError.isKpoError).toBe(true);
    });
    test(`name`, () => {
      expect(new OpenError().name).toBe('OpenError');
    });
  });
  describe(`open`, () => {
    test(`creates`, () => {
      expect(open()).toBeInstanceOf(OpenError);

      const err = Error();
      expect(open(err)).toBeInstanceOf(OpenError);
      expect(open(err).source).toBe(err);
    });
    test(`returns source`, () => {
      let err: Error;
      err = new KpoError();
      expect(open(err)).toBe(err);
      err = new OpenError();
      expect(open(err)).toBe(err);
      err = new SilentError();
      expect(open(err)).toBe(err);
    });
  });
  describe(`isOpenError`, () => {
    test(`true`, () => {
      class Err extends Error {
        public static isKpoError = true;
        public name = 'OpenError';
      }
      expect(isOpenError(new Err())).toBe(true);
      expect(isOpenError(new OpenError())).toBe(true);
    });
    test(`false`, () => {
      expect(isOpenError(new KpoError())).toBe(false);
      expect(isOpenError(new SilentError())).toBe(false);
      expect(isOpenError(Error())).toBe(false);
      expect(isOpenError({})).toBe(false);
      expect(isOpenError(null)).toBe(false);
      expect(isOpenError({ isKpoError: true, name: 'OpenError' })).toBe(false);
    });
  });
});

describe(`SilentError`, () => {
  describe(`class`, () => {
    test(`is KpoError`, () => {
      expect(new SilentError()).toBeInstanceOf(KpoError);
      expect(SilentError.isKpoError).toBe(true);
    });
    test(`name`, () => {
      expect(new SilentError().name).toBe('SilentError');
    });
  });
  describe(`isSilentError`, () => {
    test(`true`, () => {
      class Err extends Error {
        public static isKpoError = true;
        public name = 'SilentError';
      }
      expect(isSilentError(new Err())).toBe(true);
      expect(isSilentError(new SilentError())).toBe(true);
    });
    test(`false`, () => {
      expect(isSilentError(new KpoError())).toBe(false);
      expect(isSilentError(new OpenError())).toBe(false);
      expect(isSilentError(Error())).toBe(false);
      expect(isSilentError({})).toBe(false);
      expect(isSilentError(null)).toBe(false);
      expect(isSilentError({ isKpoError: true, name: 'SilentError' })).toBe(
        false
      );
    });
  });
});
