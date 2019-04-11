import path from 'path';
import getFile from '~/parse/get-file';

const at = (str?: string): string => {
  return path.join(__dirname, '../fixtures', str || '');
};

process.cwd = jest.fn().mockImplementation(() => at('js'));
const cwd: any = process.cwd;

describe(`explicit file`, () => {
  describe(`absolute`, () => {
    test(`succeeds for js`, async () => {
      const opts = {
        file: at('js/kpo.scripts.js'),
        directory: at()
      };
      await expect(getFile(opts)).resolves.toEqual(opts);
    });
    test(`succeeds for json`, async () => {
      const opts = {
        file: at('json/kpo.scripts.json'),
        directory: at()
      };
      await expect(getFile(opts)).resolves.toEqual(opts);
    });
    test(`succeeds for yml`, async () => {
      const opts = {
        file: at('yml/kpo.scripts.yml'),
        directory: at()
      };
      await expect(getFile(opts)).resolves.toEqual(opts);
    });
    test(`succeeds for yaml`, async () => {
      const opts = {
        file: at('yaml/kpo.scripts.yaml'),
        directory: at()
      };
      await expect(getFile(opts)).resolves.toEqual(opts);
    });
    test(`fails for other ext`, async () => {
      const opts = {
        file: at('fail/kpo.scripts.ts'),
        directory: at()
      };
      await expect(getFile(opts)).rejects.toBeInstanceOf(Error);
    });
    test(`fails if it doesn't exist`, async () => {
      const opts = {
        file: at('fail/kpo.scripts.js'),
        directory: at()
      };
      await expect(getFile(opts)).rejects.toBeInstanceOf(Error);
    });
  });
  describe(`relative`, () => {
    describe(`directory`, () => {
      test(`succeeds`, async () => {
        const opts = {
          file: 'js/kpo.scripts.js',
          directory: at()
        };
        await expect(getFile(opts)).resolves.toEqual({
          ...opts,
          file: at(opts.file)
        });
      });
      test(`fails`, async () => {
        const opts = {
          file: 'kpo.scripts.js',
          directory: at('foo')
        };
        await expect(getFile(opts)).rejects.toBeInstanceOf(Error);
      });
    });
    describe(`cwd`, () => {
      test(`succeeds`, async () => {
        const opts = {
          file: 'kpo.scripts.js'
        };
        await expect(getFile(opts)).resolves.toEqual({
          file: at('js/kpo.scripts.js'),
          directory: at('js')
        });
      });
      test(`fails`, async () => {
        cwd.mockImplementationOnce(() => at('foo'));
        const opts = {
          file: 'kpo.scripts.js'
        };
        await expect(getFile(opts)).rejects.toBeInstanceOf(Error);
      });
    });
  });
});
describe(`default file`, () => {
  describe(`absolute`, () => {
    test(`succeeds for js`, async () => {
      const opts = { directory: at('js') };
      await expect(getFile(opts)).resolves.toEqual({
        ...opts,
        file: at('js/kpo.scripts.js')
      });
    });
    test(`succeeds for json`, async () => {
      const opts = { directory: at('json') };
      await expect(getFile(opts)).resolves.toEqual({
        ...opts,
        file: at('json/kpo.scripts.json')
      });
    });
    test(`succeeds for yml`, async () => {
      const opts = { directory: at('yml') };
      await expect(getFile(opts)).resolves.toEqual({
        ...opts,
        file: at('yml/kpo.scripts.yml')
      });
    });
    test(`succeeds for yaml`, async () => {
      const opts = { directory: at('yaml') };
      await expect(getFile(opts)).resolves.toEqual({
        ...opts,
        file: at('yaml/kpo.scripts.yaml')
      });
    });
    test(`succeeds for package`, async () => {
      const opts = { directory: at('nested/package') };
      await expect(getFile(opts)).resolves.toEqual({
        ...opts,
        file: at('nested/package/scripts/kpo.js')
      });
    });
    test(`gives priority to default file over package`, async () => {
      const opts = { directory: at('priority') };
      await expect(getFile(opts)).resolves.toEqual({
        ...opts,
        file: at('priority/kpo.scripts.js')
      });
    });
    test(`fails`, async () => {
      const opts = { directory: at('fail') };
      await expect(getFile(opts)).rejects.toBeInstanceOf(Error);
    });
    test(`doesn't go up directories`, async () => {
      const opts = { directory: at('nested/default/inner') };
      await expect(getFile(opts)).rejects.toBeInstanceOf(Error);
    });
  });
  describe(`relative`, () => {
    describe(`directory`, () => {
      test(`succeeds for file`, async () => {
        cwd.mockImplementationOnce(() => at());
        const opts = { directory: 'js' };
        await expect(getFile(opts)).resolves.toEqual({
          file: at('js/kpo.scripts.js'),
          directory: at('js')
        });
      });
      test(`succeeds for package`, async () => {
        cwd.mockImplementationOnce(() => at());
        const opts = { directory: 'nested/package' };
        await expect(getFile(opts)).resolves.toEqual({
          file: at('nested/package/scripts/kpo.js'),
          directory: at('nested/package')
        });
      });
      test(`gives priority to default file`, async () => {
        cwd.mockImplementationOnce(() => at());
        await expect(getFile({ directory: 'priority' })).resolves.toEqual({
          file: at('priority/kpo.scripts.js'),
          directory: at('priority')
        });
      });
      test(`fails`, async () => {
        const opts = { directory: at('foo') };
        await expect(getFile(opts)).rejects.toBeInstanceOf(Error);
      });
      test(`doesn't go up directories`, async () => {
        cwd.mockImplementationOnce(() => at('nested/default'));
        const opts = { directory: at('inner') };
        await expect(getFile(opts)).rejects.toBeInstanceOf(Error);
      });
    });
    describe(`cwd`, () => {
      test(`succeeds for file`, async () => {
        await expect(getFile({})).resolves.toEqual({
          file: at('js/kpo.scripts.js'),
          directory: at('js')
        });
      });
      test(`succeeds for package`, async () => {
        cwd.mockImplementationOnce(() => at('nested/package'));
        await expect(getFile({})).resolves.toEqual({
          file: at('nested/package/scripts/kpo.js'),
          directory: at('nested/package')
        });
      });
      test(`gives priority to default file`, async () => {
        cwd.mockImplementationOnce(() => at('priority'));
        await expect(getFile({})).resolves.toEqual({
          file: at('priority/kpo.scripts.js'),
          directory: at('priority')
        });
      });
      test(`goes up directories for file`, async () => {
        cwd.mockImplementationOnce(() => at('nested/default/inner'));
        await expect(getFile({})).resolves.toEqual({
          file: at('nested/default/kpo.scripts.js'),
          directory: at('nested/default')
        });
      });
      test(`goes up directories for package`, async () => {
        cwd.mockImplementationOnce(() => at('nested/package/inner'));
        await expect(getFile({})).resolves.toEqual({
          file: at('nested/package/scripts/kpo.js'),
          directory: at('nested/package')
        });
      });
      test(`fails`, async () => {
        cwd.mockImplementationOnce(() => at('foo'));
        await expect(getFile({})).rejects.toBeInstanceOf(Error);
      });
    });
  });
});
