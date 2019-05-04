import cache from '~/utils/cache';

test(`succeeds`, async () => {
  let id = '1';
  const getId = jest.fn().mockImplementation(() => id);
  const cb = jest.fn().mockImplementation(() => 'foo');
  const fn = cache(getId, cb);

  expect(fn()).toBe('foo');
  expect(getId).toHaveBeenCalledTimes(1);
  expect(cb).toHaveBeenCalledTimes(1);

  cb.mockImplementation(() => 'bar');
  expect(fn()).toBe('foo');
  expect(getId).toHaveBeenCalledTimes(2);
  expect(cb).toHaveBeenCalledTimes(1);

  id = '2';
  expect(fn()).toBe('bar');
  expect(getId).toHaveBeenCalledTimes(3);
  expect(cb).toHaveBeenCalledTimes(2);

  id = '3';
  cb.mockImplementation(() => Promise.resolve('baz'));
  await expect(fn()).resolves.toBe('baz');
  expect(getId).toHaveBeenCalledTimes(4);
  expect(cb).toHaveBeenCalledTimes(3);

  await expect(fn()).resolves.toBe('baz');
  expect(getId).toHaveBeenCalledTimes(5);
  expect(cb).toHaveBeenCalledTimes(3);
});

test(`fails`, async () => {
  expect(
    cache(
      () => 'foo',
      () => {
        throw Error();
      }
    )
  ).toThrowError();
  await expect(
    cache(() => 'foo', () => Promise.reject(Error()))()
  ).rejects.toThrowError();
});
