import pkg from '../package.json';

export const constants = {
  bin: 'kpo',
  file: 'kpo.tasks.js',
  description: pkg.description || '',
  version: pkg.version || 'Unknown',
  record: { default: 'default' }
};
