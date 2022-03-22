import pkg from '../package.json';

export const constants = {
  name: pkg.name,
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
