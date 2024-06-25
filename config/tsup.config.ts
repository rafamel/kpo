/* eslint-disable regexp/no-super-linear-backtracking */
import fs from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';
import type { Options } from 'tsup';

import project from './project.config.mjs';

const { build, extensions } = project;
const { source } = extensions;
export default async (): Promise<Options> => ({
  entry: await glob([`./src/**/*.{${source.join(',')}}`], {
    ignore: ['**/*.{test,spec}.*'],
    nodir: true
  }),
  outDir: build.directory,
  target: 'es2022',
  format: 'esm',
  dts: true,
  clean: false,
  watch: false,
  minify: false,
  bundle: true,
  sourcemap: true,
  splitting: false,
  skipNodeModulesBundle: true,
  plugins: [
    {
      name: 'import-json-modules',
      renderChunk: (_, { code }) => {
        const regex = /(import\s+.+\s+from\s+['"])(.+\.json)(['"]);/g;
        return { code: code.replace(regex, `$1$2$3 with { type: "json" };`) };
      }
    }
  ],
  esbuildPlugins: [
    {
      name: 'js-extension',
      setup(build) {
        build.onResolve({ filter: /.*/ }, async ({ path: file, ...args }) => {
          if (args.importer) {
            const ext = path.extname(file);
            if (ext) {
              return {
                path: source.includes(ext.slice(1))
                  ? file.substring(0, file.length - ext.length) + '.js'
                  : file,
                external: true
              };
            }

            const isDir = await fs.promises
              .stat(path.resolve(args.resolveDir, file))
              .then(
                (stat) => stat.isDirectory(),
                (err) => (err.code === 'ENOENT' ? false : Promise.reject(err))
              );

            file = isDir ? file + path.sep + 'index.js' : file + '.js';
            return { path: file, external: true };
          }
        });
      }
    }
  ]
});
