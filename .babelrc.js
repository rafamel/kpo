const project = require('./project.config');

const vars = {
  esnext: !!process.env.ESNEXT,
  typescript: project.get('typescript')
};

module.exports = {
  presets: [
    !vars.esnext && ['@babel/preset-env', { targets: { node: '8.0.0' } }],
    vars.typescript && '@babel/typescript'
  ].filter(Boolean),
  plugins: [
    ['babel-plugin-module-resolver', { alias: { '~': './src' } }],
    ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: false }],
    '@babel/plugin-proposal-class-properties',
    ['@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }]
  ],
  ignore: ['node_modules', '**/*.d.ts']
};
