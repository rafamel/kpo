import { into } from 'pipettes';

export const constants = into(
  { pkg: require('../package.json') },
  ({ pkg }) => ({
    cli: {
      bin: 'kpo',
      version: pkg.version || 'Unknown',
      description: pkg.description || ''
    },
    defaults: {
      task: 'default',
      level: 'info' as 'info',
      file: 'kpo.tasks.js'
    },
    collections: {
      restrict: [':'],
      levels: ['silent', 'error', 'warn', 'info', 'debug', 'trace']
    }
  })
);
