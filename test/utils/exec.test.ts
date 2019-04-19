import exec from '~/utils/exec';
import { spawn } from 'child_process';
import { DEFAULT_STDIO } from '~/constants';
import { IOfType } from '~/types';

jest.mock('child_process');
const mocks: IOfType<jest.Mock<any, any>> = {
  spawn
} as any;
beforeEach(() => Object.values(mocks).forEach((mock) => mock.mockClear()));

mocks.spawn.mockImplementation(() => {
  jest.unmock('child_process');
  return require('child_process').spawn('shx', ['echo', 'foo']);
});

test(`succeeds`, async () => {
  const { ps, promise } = exec('foo bar --baz');
  expect(ps).toHaveProperty('on');
  expect(promise).toBeInstanceOf(Promise);
  await expect(promise).resolves.toBeUndefined();
  expect(mocks.spawn).toHaveBeenCalledTimes(1);
  expect(mocks.spawn.mock.calls[0][1].includes('foo bar --baz')).toBe(true);
  expect(mocks.spawn.mock.calls[0][2]).toHaveProperty('stdio', DEFAULT_STDIO);
  expect(mocks.spawn.mock.calls[0][2]).toHaveProperty('env', process.env);
});
test(`fails on non existent binary`, async () => {
  mocks.spawn.mockImplementationOnce(() => {
    return require('child_process').spawn('_nonExistentBin_');
  });

  const { promise } = exec('foo bar --baz');
  await expect(promise).rejects.toBeInstanceOf(Error);
  expect(mocks.spawn.mock.calls[0][1].includes('foo bar --baz')).toBe(true);
});
test(`Fails on spawn process error`, async () => {
  mocks.spawn.mockImplementationOnce(() => {
    return require('child_process').spawn('shx', ['error']);
  });

  const { promise } = exec('foo bar --baz');
  await expect(promise).rejects.toBeInstanceOf(Error);
  expect(mocks.spawn.mock.calls[0][1].includes('foo bar --baz')).toBe(true);
});
test(`passes options`, async () => {
  const { promise } = exec('foo bar --baz', { foo: 'bar' } as any);
  await expect(promise).resolves.toBeUndefined();
  expect(mocks.spawn.mock.calls[0][2]).toHaveProperty('foo', 'bar');
});
test(`passes stdio`, async () => {
  const { promise } = exec('foo bar --baz', { stdio: 'ignore' });
  await expect(promise).resolves.toBeUndefined();
  expect(mocks.spawn.mock.calls[0][2]).toHaveProperty('stdio', 'ignore');
});
test(`passes env`, async () => {
  const { promise } = exec('foo bar --baz', { env: { foo: 'bar' } });
  await expect(promise).resolves.toBeUndefined();
  expect(mocks.spawn.mock.calls[0][2]).toHaveProperty('env', { foo: 'bar' });
});
