import path from 'path';
import load from '~/utils/file/load';

const at = (str?: string): string => {
  return path.join(__dirname, '../../fixtures', str || '');
};

const to = { foo: 'bar', baz: 'foobar' };

test(`reads js`, async () => {
  await expect(load(at('js/kpo.scripts.js'))).resolves.toEqual(to);
});

test(`reads json`, async () => {
  await expect(load(at('json/kpo.scripts.json'))).resolves.toEqual(to);
});

test(`reads yml`, async () => {
  await expect(load(at('yml/kpo.scripts.yml'))).resolves.toEqual(to);
});

test(`reads yaml`, async () => {
  await expect(load(at('yaml/kpo.scripts.yaml'))).resolves.toEqual(to);
});

test(`fails for invalid ext`, async () => {
  await expect(load(at('fail/kpo.scripts.ts'))).rejects.toBeInstanceOf(Error);
});
