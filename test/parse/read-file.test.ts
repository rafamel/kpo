import path from 'path';
import readFile from '~/parse/read-file';

const at = (str?: string): string => {
  return path.join(__dirname, '../fixtures', str || '');
};

const to = { foo: 'bar', baz: 'foobar' };

test(`reads js`, async () => {
  await expect(readFile(at('js/kpo.scripts.js'))).resolves.toEqual(to);
});

test(`reads json`, async () => {
  await expect(readFile(at('json/kpo.scripts.json'))).resolves.toEqual(to);
});

test(`reads yml`, async () => {
  await expect(readFile(at('yml/kpo.scripts.yml'))).resolves.toEqual(to);
});

test(`reads yaml`, async () => {
  await expect(readFile(at('yaml/kpo.scripts.yaml'))).resolves.toEqual(to);
});

test(`fails for invalid ext`, async () => {
  await expect(readFile(at('fail/kpo.scripts.ts'))).rejects.toBeInstanceOf(
    Error
  );
});
