import path from 'path';
import up from 'find-up';
import { absolute, exists, find } from '~/utils/file';
import { IOfType } from '~/types';

jest.mock('find-up');
const mocks: IOfType<jest.Mock<any, any>> = {
  up
} as any;
beforeEach(() => Object.values(mocks).forEach((mock) => mock.mockClear()));
mocks.up.mockImplementation(() => 'foo/bar.js');

const at = (str?: string): string => {
  return path.join(__dirname, '../fixtures', str || '');
};

describe(`absolute`, () => {
  test(`succeeds`, () => {
    expect(absolute({ path: 'bar/baz', cwd: '/foo' })).toBe('/foo/bar/baz');
    expect(absolute({ path: './bar/baz', cwd: '/foo' })).toBe('/foo/bar/baz');
    expect(absolute({ path: '/bar/baz', cwd: '/foo' })).toBe('/bar/baz');
  });
});
describe(`exists`, () => {
  test(`succeeds w/ file`, async () => {
    await expect(exists(at('js/kpo.scripts.js'))).resolves.toBe(true);
    await expect(exists(at('js/kpo.scripts.js'), { fail: true })).resolves.toBe(
      true
    );
  });
  test(`succeeds w/ dir`, async () => {
    await expect(exists(at('js'))).resolves.toBe(true);
    await expect(exists(at('js'), { fail: true })).resolves.toBe(true);
  });
  test(`fails`, async () => {
    await expect(exists(at('foo'))).resolves.toBe(false);
    await expect(exists(at('foo'), { fail: true })).rejects.toThrowError();
  });
});
describe(`find`, () => {
  describe(`!strict`, () => {
    test(`succeeds`, async () => {
      await expect(find('foo', 'bar/baz')).resolves.toBe('foo/bar.js');
      await expect(find(['bar'], 'foobar', false)).resolves.toBe('foo/bar.js');
      expect(mocks.up).toHaveBeenCalledTimes(2);
      expect(mocks.up).toHaveBeenNthCalledWith(1, 'foo', {
        cwd: 'bar/baz'
      });
      expect(mocks.up).toHaveBeenNthCalledWith(2, ['bar'], {
        cwd: 'foobar'
      });
    });
    test(`fails`, async () => {
      mocks.up.mockImplementation(() => Promise.reject(Error()));
      await expect(find('foo', 'bar')).rejects.toThrowError();
      await expect(find('foo', 'bar', false)).rejects.toThrowError();
      mocks.up.mockImplementation(() => 'foo/bar.js');
    });
  });
  describe(`strict`, () => {
    test(`succeeds w/ single file`, async () => {
      await expect(find('kpo.scripts.js', at('js'), true)).resolves.toBe(
        at('js/kpo.scripts.js')
      );
      expect(mocks.up).not.toHaveBeenCalled();
    });
    test(`succeeds w/ array`, async () => {
      await expect(
        find(['foo.bar.js', 'kpo.scripts.js'], at('js'), true)
      ).resolves.toBe(at('js/kpo.scripts.js'));
      expect(mocks.up).not.toHaveBeenCalled();
    });
    test(`succeeds on non existent file`, async () => {
      await expect(
        find(['foo.bar.js', 'bar.foo.js'], at('js'), true)
      ).resolves.toBe(null);
    });
    test(`fails on non existent dir`, async () => {
      await expect(
        find(['foo.bar.js', 'bar.foo.js'], at('foo'), true)
      ).rejects.toThrowError();
    });
    test(`fails if dir is a file`, async () => {
      await expect(
        find(['foo.bar.js', 'bar.foo.js'], at('js/kpo.scripts.js'), true)
      ).rejects.toThrowError();
    });
  });
});
