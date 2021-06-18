import { into } from 'pipettes';

export const constants = into(
  { pkg: require('../package.json') },
  ({ pkg }) => ({
    cli: {
      bin: 'kpo',
      file: 'kpo.tasks.js',
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
  })
);
