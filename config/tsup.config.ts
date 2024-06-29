import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { glob } from 'glob';
import type { Options } from 'tsup';
import { resolve } from 'import-meta-resolve';

import project from './project.config.mjs';

const extensions = project.extensions;
const destination = project.build.directory;
export default async (): Promise<Options> => {
  return Promise.resolve(import.meta.dirname)
    .then((dir) => pathToFileURL(path.join(dir, '../', 'node_modules', 'kpo')))
    .then((parent) => import(resolve('kpo', parent.toString())))
    .then(async ({ exec, remove, run }) => ({
      entry: await glob([`./src/**/*.{${extensions.source.join(',')}}`], {
        ignore: ['**/*.{test,spec}.*'],
        nodir: true
      }),
      outDir: destination,
      target: 'es2022',
      format: 'esm',
      dts: true,
      clean: true,
      watch: false,
      minify: false,
      bundle: true,
      sourcemap: true,
      splitting: true,
      skipNodeModulesBundle: true,
      esbuildPlugins: [
        {
          name: 'bundle-content',
          setup(build) {
            build.onResolve(
              { filter: /.*/ },
              async ({ path: file, importer }) => {
                if (!importer) return;
                const extension = path.extname(file).substring(1);
                const external =
                  !extension || extensions.source.includes(extension);
                return { external };
              }
            );
          }
        }
      ],
      plugins: [
        {
          name: 'full-clean',
          buildStart() {
            if (!this.options.clean) return;
            const pattern = path.join(this.options.outDir, '*');
            return run(null, remove(pattern, { glob: true, recursive: true }));
          }
        },
        {
          name: 'paths-resolve',
          buildEnd: () => {
            const task = exec('tsc-alias', [
              ...['--project', './tsconfig.json', '--outDir', destination],
              ...['--resolve-full-paths']
            ]);
            return run(null, task);
          }
        }
      ]
    }));
};
