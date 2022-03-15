import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    kpo: 'src/cli/kpo.ts'
  },
  format: ['esm'],
  platform: 'node',
  target: ['node16'],
  outDir: 'build',
  dts: true,
  splitting: true,
  sourcemap: true,
  minify: false,
  clean: false,
  noExternal: ['ci-info']
});
