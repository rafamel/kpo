import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { resolve } from 'import-meta-resolve';

import riseup from './config/riseup.config.mjs';
import project from './config/project.config.mjs';

const { build } = project;
export default Promise.resolve(import.meta.dirname)
  .then((dir) => pathToFileURL(path.join(dir, 'node_modules', 'kpo')))
  .then((parent) => import(resolve('kpo', parent)))
  .then(
    ({ catches, create, exec, finalize, lift, recreate, remove, series }) => {
      return recreate({ announce: true }, () => {
        const tasks = {
          start: exec('node', [build.directory]),
          watch: exec('tsx', ['--watch', './src']),
          build: series(
            remove(path.join(build.directory, '*'), {
              glob: true,
              recursive: true
            }),
            exec('tsup', ['--config', './config/tsup.config.ts'])
          ),
          tarball: exec('npm', ['pack']),
          docs: exec('typedoc', ['--options', './config/typedoc.config.json']),
          lint: finalize(exec('eslint', ['.']), exec('tsc', ['--noEmit'])),
          fix: exec('eslint', ['.', '--fix']),
          test: exec('jest', [
            ...['--passWithNoTests', '--detectOpenHandles'],
            ...['-c', './config/jest.config.mjs']
          ]),
          commit: riseup.tasks.commit,
          release: riseup.tasks.release,
          distribute: riseup.tasks.distribute,
          validate: series(
            create(() => tasks.lint),
            create(() => tasks.test),
            lift({ purge: true, mode: 'audit' }, () => tasks),
            catches({ level: 'silent' }, exec('npm', ['audit']))
          ),
          /* Hooks */
          version: series(
            create(() => tasks.validate),
            create(() => tasks.build),
            create(() => tasks.docs)
          )
        };
        return tasks;
      });
    }
  );
