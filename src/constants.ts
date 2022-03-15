import path from 'node:path';
import pkg from '../package.json';

export const constants = {
  root: path.join(import.meta.url, '../../'),
  cli: {
    bin: 'kpo',
    files: ['kpo.tasks.js', 'kpo.tasks.mjs', 'kpo.tasks.cjs'],
    property: null,
    version: pkg.version || 'Unknown',
    description: pkg.description || '',
    multitask: true
  },
  defaults: {
    task: 'default',
    level: 'info' as const
  },
  collections: {
    restrict: [':']
  }
};
