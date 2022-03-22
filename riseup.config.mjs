import { Preset } from '@riseup/utils';
import { Library } from '@riseup/library';
import { Tooling } from '@riseup/tooling';
import { Universal } from '@riseup/universal';

export default Preset.combine(
  new Library({
    tarball: {
      // Package tarball file name
      destination: null,
      // Enable monorepo dependencies inclusion in tarball
      monorepo: false
    },
    docs: {
      // Build typedoc documentation
      build: true,
      // Documentation build folder
      destination: 'docs/',
      // Typedoc configuration overrides
      overrides: {}
    },
    distribute: {
      // Push repository and tags upon distribution (publication)
      push: true
    }
  }),
  new Tooling({
    global: {
      // Enable prettier
      prettier: true,
      // Project platform: node, browser, neutral
      platform: 'node',
      // Transpile loaders
      loaders: {},
      // Runtime stubs
      stubs: {}
    },
    build: {
      // Clean directory upon build
      clean: true,
      // Output directory
      outdir: 'build/',
      // Entrypoints
      entries: {
        index: 'src/index.ts',
        kpo: 'src/cli/kpo.ts'
      },
      // Formats: module, commonjs, iife
      formats: ['module'],
      // Build targets
      targets: ['node16'],
      // Enable minification
      minify: false,
      // Enable code splitting
      splitting: true,
      // Specifiers to include in bundle
      // Set to null to skip external modules
      include: ['./*', '../*', 'ci-info/*.json'],
      // Specifiers to override bundle inclusions
      exclude: [],
      // Environment variables injection
      env: {}
    },
    node: {
      // Transpilation format for runtime: module, commonjs
      format: 'commonjs',
      // Paths to include in transpilation
      // Set to null to skip external modules
      include: ['*'],
      // Paths to override transpilation inclusions
      exclude: []
    },
    lint: {
      // Directories to lint
      dir: ['src/', 'test/'],
      // Run type checks
      types: true,
      // Enable react presets
      react: false,
      // Keywords that should output warnings
      highlight: ['fixme', 'todo', 'refactor'],
      // ESLint rules overwrites
      rules: {}
    },
    test: {
      // Whether to print all passed tests
      verbose: false,
      // RegExp array of files to ignore
      ignore: [],
      // Array of setup files
      require: [],
      // Files to include in coverage: auto, all, none
      coverage: 'auto',
      // Fail when coverage is under the threshold
      threshold: null,
      // Jest configuration overrides
      overrides: {},
      // Paths to include in transpilation
      // Set to null to skip external modules
      include: ['*'],
      // Paths to override transpilation inclusions
      exclude: []
    }
  }),
  new Universal({
    lintmd: {
      // Glob of markdown files to lint
      include: './README.md',
      // Markdownlint configuration overrides
      overrides: {}
    },
    release: {
      // Conventional commits preset
      preset: 'angular',
      // Generate changelog upon release (version bump)
      changelog: true
    }
  })
);
