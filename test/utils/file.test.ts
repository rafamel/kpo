import path from 'path';
import _findUp from 'find-up';
import { find, exists } from '~/utils/file';

jest.mock('find-up');
const findUp: any = _findUp;
findUp.mockImplementation(() => 'foo/bar.js');

const at = (str?: string): string => {
  return path.join(__dirname, '../fixtures', str || '');
};

describe(`find`, () => {
  describe(`!strict`, () => {
    test(`succeeds`, async () => {
      findUp.mockClear();
      await expect(find('foo', 'bar/baz')).resolves.toBe('foo/bar.js');
      await expect(find(['bar'], 'foobar', false)).resolves.toBe('foo/bar.js');
      expect(findUp).toHaveBeenCalledTimes(2);
      expect(findUp).toHaveBeenNthCalledWith(1, 'foo', { cwd: 'bar/baz' });
      expect(findUp).toHaveBeenNthCalledWith(2, ['bar'], { cwd: 'foobar' });
    });
    test(`fails`, async () => {
      findUp.mockImplementation(() => Promise.reject(Error()));
      await expect(find('foo', 'bar')).rejects.toBeInstanceOf(Error);
      await expect(find('foo', 'bar', false)).rejects.toBeInstanceOf(Error);
      findUp.mockImplementation(() => 'foo/bar.js');
    });
  });
  describe(`strict`, () => {
    test(`succeeds w/ single file`, async () => {
      findUp.mockClear();
      await expect(find('kpo.scripts.js', at('js'), true)).resolves.toBe(
        at('js/kpo.scripts.js')
      );
      expect(findUp).not.toHaveBeenCalled();
    });
    test(`succeeds w/ array`, async () => {
      findUp.mockClear();
      await expect(
        find(['foo.bar.js', 'kpo.scripts.js'], at('js'), true)
      ).resolves.toBe(at('js/kpo.scripts.js'));
      expect(findUp).not.toHaveBeenCalled();
    });
    test(`succeeds on non existent file`, async () => {
      await expect(
        find(['foo.bar.js', 'bar.foo.js'], at('js'), true)
      ).resolves.toBe(null);
    });
    test(`fails on non existent dir`, async () => {
      await expect(
        find(['foo.bar.js', 'bar.foo.js'], at('foo'), true)
      ).rejects.toBeInstanceOf(Error);
    });
    test(`fails if dir is a file`, async () => {
      await expect(
        find(['foo.bar.js', 'bar.foo.js'], at('js/kpo.scripts.js'), true)
      ).rejects.toBeInstanceOf(Error);
    });
  });
});

describe(`exists`, () => {
  test(`succeeds w/ file`, async () => {
    await expect(exists(at('js/kpo.scripts.js'))).resolves.toBeUndefined();
  });
  test(`succeeds w/ dir`, async () => {
    await expect(exists(at('js'))).resolves.toBeUndefined();
  });
  test(`fails`, async () => {
    await expect(exists(at('foo'))).rejects.toBeInstanceOf(Error);
  });
});
