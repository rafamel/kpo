import guardian from '~/utils/guardian';
import { KPO_EXIT_ENV } from '~/constants';

test(`passes`, () => {
  expect(guardian()).toBeUndefined();
});
test(`fails`, () => {
  process.env[KPO_EXIT_ENV] = 'true';
  expect(() => guardian()).toThrowError();
  process.env[KPO_EXIT_ENV] = '1';
  expect(() => guardian()).toThrowErrorMatchingInlineSnapshot(
    `"Process is terminating"`
  );
});
