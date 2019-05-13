import confirm from '~/utils/confirm';
import prompts from 'prompts';
import { IOfType } from '~/types';

jest.mock('prompts');
const mocks: IOfType<jest.Mock> = {
  prompts
} as any;

mocks.prompts.mockImplementation(() => Promise.resolve({ value: false }));
beforeEach(() => Object.values(mocks).forEach((mock) => mock.mockClear()));

test(`returns true for !options.confirm`, async () => {
  await expect(confirm('')).resolves.toBe(true);
  await expect(confirm('', {})).resolves.toBe(true);
  await expect(confirm('', { fail: true })).resolves.toBe(true);
  await expect(confirm('', { confirm: false, fail: true })).resolves.toBe(true);
  expect(mocks.prompts).not.toHaveBeenCalled();
});
test(`returns prompts result for options.confirm = true`, async () => {
  await expect(confirm('Message', { confirm: true })).resolves.toBe(false);

  mocks.prompts.mockImplementationOnce(() => Promise.resolve({ value: true }));
  await expect(confirm('', { confirm: true, fail: true })).resolves.toBe(true);

  expect(mocks.prompts).toHaveBeenCalledTimes(2);
  expect(mocks.prompts.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "initial": true,
        "message": "Message",
        "name": "value",
        "type": "confirm",
      },
    ]
  `);
});
test(`fails on options.fail = true`, async () => {
  await expect(
    confirm('', { confirm: true, fail: true })
  ).rejects.toThrowErrorMatchingInlineSnapshot(`"Cancelled by user"`);
});
