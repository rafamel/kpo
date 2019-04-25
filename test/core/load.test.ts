import path from 'path';
import { loadFile } from '~/core/load';

const at = (str?: string): string => {
  return path.join(__dirname, '../fixtures', str || '');
};

const to = { foo: 'bar', baz: 'foobar' };

test(`reads js`, async () => {
  await expect(loadFile(at('js/kpo.scripts.js'))).resolves.toEqual(to);
});

test(`reads json`, async () => {
  await expect(loadFile(at('json/kpo.scripts.json'))).resolves.toEqual(to);
});

test(`reads yml`, async () => {
  await expect(loadFile(at('yml/kpo.scripts.yml'))).resolves.toEqual(to);
});

test(`reads yaml`, async () => {
  await expect(loadFile(at('yaml/kpo.scripts.yaml'))).resolves.toEqual(to);
});

test(`fails for invalid ext`, async () => {
  await expect(loadFile(at('fail/kpo.scripts.ts'))).rejects.toBeInstanceOf(
    Error
  );
});
