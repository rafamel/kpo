import EnvManager from '~/utils/env-manager';
import pathKey from 'path-key';

jest.mock('path-key');
(pathKey as any).mockImplementation(() => 'Foo');

describe(`$PATH`, () => {
  test(`obstains $PATH`, () => {
    expect(new EnvManager({}).path).toBe('Foo');
  });
  test(`adds paths`, () => {
    const manager = new EnvManager({});
    manager.addPaths(['foo/bar', 'bar/baz']);

    expect(manager.get('Foo')).toMatchInlineSnapshot(`"foo/bar:bar/baz"`);
    manager.addPaths(['foo/bar', 'bar/baz']);
    expect(manager.get('Foo')).toMatchInlineSnapshot(
      `"foo/bar:bar/baz:foo/bar:bar/baz"`
    );
  });
});
describe(`getters/setters`, () => {
  test(`get`, () => {
    const manager = new EnvManager({ foo: 'bar', bar: 'baz' });
    expect(manager.get('foobar')).toBeUndefined();
    expect(manager.get('foo')).toBe('bar');
  });
  test(`set`, () => {
    const manager = new EnvManager({ foo: 'bar', bar: 'baz' });
    manager.set('foobar', 'foobar');
    manager.set('foo', 'foobar');

    expect(manager.get('foobar')).toBe('foobar');
    expect(manager.get('foo')).toBe('foobar');

    manager.set('foo');
    expect(manager.get('foo')).toBeUndefined();
  });
  test(`default`, () => {
    const manager = new EnvManager({ foo: 'bar', bar: 'baz' });
    expect(manager.default('foo', 'baz')).toBe('bar');
    expect(manager.default('baz', 'foo')).toBe('foo');
  });
  test(`assign`, () => {
    const obj = { foo: 'bar', bar: 'baz' };
    const manager = new EnvManager(obj);
    manager.assign({ foo: 'foo', baz: 'foo' });
    expect(obj).toEqual({ foo: 'foo', bar: 'baz', baz: 'foo' });
  });
});
describe(`restore`, () => {
  test(`restores all`, () => {
    const obj = {
      foo: 'bar',
      bar: 'baz',
      Foo: 'foo/bar:bar/baz'
    };
    const clone = Object.assign({}, obj);
    const manager = new EnvManager(obj);

    manager.assign({ foo: 'foo', baz: 'foo' });
    manager.set('bar');
    manager.default('foobar', 'foobar');
    manager.addPaths(['foobar/foobar']);

    expect(obj).toEqual({
      foo: 'foo',
      bar: undefined,
      Foo: 'foobar/foobar:foo/bar:bar/baz',
      baz: 'foo',
      foobar: 'foobar'
    });
    expect(obj).not.toEqual(clone);
    manager.restore();
    expect(obj).toEqual(clone);
    expect(manager.get('bar')).toBe('baz');
    expect(manager.get('baz')).toBeUndefined();
  });
  test(`doesn't restore external changes`, () => {
    const obj: any = { foo: 'bar', bar: 'baz' };
    const manager = new EnvManager(obj);

    manager.assign({ foo: 'baz', baz: 'foo' });
    obj.foo = 'foo';
    obj.foobar = 'foobar';
    manager.restore();
    expect(obj).toEqual({ foo: 'foo', bar: 'baz', foobar: 'foobar' });
  });
});
