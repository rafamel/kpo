import inVersionRange from '~/utils/version-range';

describe(`all`, () => {
  test(`errors out for undefined`, () => {
    expect(() => inVersionRange('1.0.1')).toThrowErrorMatchingInlineSnapshot(
      `"Version could not be parsed"`
    );
    expect(() => inVersionRange(undefined, '1.0.1')).toThrowError();
    expect(() => inVersionRange()).toThrowError();
  });
});
describe(`stable`, () => {
  test(`true for equal`, () => {
    expect(inVersionRange('1.0.1', '1.0.1')).toBe(true);
  });
  test(`true for patch`, () => {
    expect(inVersionRange('1.0.1', '1.0.2')).toBe(true);
  });
  test(`true for minor`, () => {
    expect(inVersionRange('1.1.1', '1.2.1')).toBe(true);
    expect(inVersionRange('1.2.9', '1.1.1')).toBe(true);
  });
  test(`false for major`, () => {
    expect(inVersionRange('1.1.1', '2.1.1')).toBe(false);
  });
});
describe(`unstable`, () => {
  test(`true for equal`, () => {
    expect(inVersionRange('0.1.1', '0.1.1')).toBe(true);
  });
  test(`false for patch`, () => {
    expect(inVersionRange('0.1.1', '0.1.2')).toBe(false);
  });
  test(`false for minor`, () => {
    expect(inVersionRange('0.1.1', '0.2.1')).toBe(false);
    expect(inVersionRange('0.2.9', '0.1.1')).toBe(false);
  });
  test(`false for major`, () => {
    expect(inVersionRange('0.1.1', '1.1.1')).toBe(false);
  });
});
