import process from 'node:process';
import { convert } from 'tsconfig-to-swcconfig';

import project from './project.config.mjs';

const { source, content } = project.extensions;
const swc = convert();
export default async () => ({
  /* Root Paths  */
  roots: ['<rootDir>/../src/', '<rootDir>/../test/'],
  /* Environment */
  setupFiles: [],
  clearMocks: true,
  injectGlobals: false,
  testEnvironment: 'node',
  /* Modules */
  moduleFileExtensions: source.concat(content),
  modulePathIgnorePatterns: ['.*\\.d\\.ts$', '/__mocks__/', '/@types/'],
  extensionsToTreatAsEsm: source
    .filter((ext) => !['cjs', 'mjs', 'js'].includes(ext))
    .map((ext) => `.${ext}`),
  /* Coverage */
  collectCoverage: true,
  coverageProvider: 'v8',
  coverageDirectory: '<rootDir>/../coverage',
  coverageThreshold: { global: {} },
  collectCoverageFrom: [`<rootDir>/../src/**/*.{${source.join(',')}}`],
  coveragePathIgnorePatterns: [
    '.*\\.d\\.ts$',
    '/node_modules/',
    '/__mocks__/',
    '/@types/',
    '/vendor/'
  ],
  /* Test Match Patterns */
  testMatch: [`<rootDir>/../**/*.{test,spec}.{${source.join(',')}}`],
  testPathIgnorePatterns: [
    `.*/(test|spec)\\.(${source.join('|')})$`,
    '/node_modules/'
  ],
  /* Transforms */
  transformIgnorePatterns: [],
  transform: {
    [`^.+\\.(${source.concat(content).join('|')})$`]: [
      '@swc/jest',
      {
        ...swc,
        $schema: 'https://swc.rs/schema.json',
        minify: false,
        sourceMaps: 'inline',
        module: {
          ...swc.module,
          type: 'es6',
          resolveFully: false,
          ignoreDynamic: false
        },
        env: {
          ...swc.env,
          targets: 'Node >= ' + process.version.split(/v|\./).at(1)
        },
        jsc: {
          ...swc.jsc,
          target: null,
          keepClassNames: true,
          externalHelpers: false,
          preserveAllComments: true
        }
      }
    ]
  }
  /* 
    moduleNameMapper: await import('jest-module-name-mapper').then((nm) => {
      return nm.default.default();
    }),
    transform: {
       [`^.+\\.(${source.concat(content).join('|')})$`]: [
        'jest-esbuild',
        {
          format: 'cjs',
          target: 'node' + process.version.split(/v|\./).at(1),
          supported: { 'dynamic-import': false }
        }
      ]
    }
  */
});
