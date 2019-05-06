import inVersionRange from '~/utils/version-range';

describe(`all`, () => {
  test(`fails for undefined`, () => {
    expect(() => inVersionRange('1.0.1')).toThrowErrorMatchingInlineSnapshot(
      `"Version could not be parsed"`
    );
    expect(() => inVersionRange(undefined, '1.0.1')).toThrowError();
    expect(() => inVersionRange()).toThrowError();
  });
});
describe(`stable`, () => {
  test(`succeeds for equal`, () => {
    expect(() => inVersionRange('1.0.1', '1.0.1')).not.toThrow();
  });
  test(`succeeds for patch`, () => {
    expect(() => inVersionRange('1.0.1', '1.0.2')).not.toThrow();
  });
  test(`succeeds for minor`, () => {
    expect(() => inVersionRange('1.1.1', '1.2.1')).not.toThrow();
    expect(() => inVersionRange('1.2.9', '1.1.1')).not.toThrow();
  });
  test(`fails for major`, () => {
    expect(() =>
      inVersionRange('1.1.1', '2.1.1')
    ).toThrowErrorMatchingInlineSnapshot(
      `"Local kpo version (1.1.1) doesn't match executing version (2.1.1)"`
    );
  });
});
describe(`unstable`, () => {
  test(`succeedsfor equal`, () => {
    expect(() => inVersionRange('0.1.1', '0.1.1')).not.toThrow();
  });
  test(`fails for patch`, () => {
    expect(() =>
      inVersionRange('0.1.1', '0.1.2')
    ).toThrowErrorMatchingInlineSnapshot(
      `"Local kpo version (0.1.1) doesn't match executing version (0.1.2)"`
    );
  });
  test(`fails for minor`, () => {
    expect(() =>
      inVersionRange('0.1.1', '0.2.1')
    ).toThrowErrorMatchingInlineSnapshot(
      `"Local kpo version (0.1.1) doesn't match executing version (0.2.1)"`
    );
    expect(() =>
      inVersionRange('0.2.9', '0.1.1')
    ).toThrowErrorMatchingInlineSnapshot(
      `"Local kpo version (0.2.9) doesn't match executing version (0.1.1)"`
    );
  });
  test(`fails for major`, () => {
    expect(() =>
      inVersionRange('0.1.1', '1.1.1')
    ).toThrowErrorMatchingInlineSnapshot(
      `"Local kpo version (0.1.1) doesn't match executing version (1.1.1)"`
    );
  });
});
