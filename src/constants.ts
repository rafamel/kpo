import { into } from 'pipettes';

export const constants = into(
  { pkg: require('../package.json') },
  ({ pkg }) => ({
    bin: 'kpo',
    file: 'kpo.tasks.js',
    description: pkg.description || '',
    version: pkg.version || 'Unknown',
    record: {
      default: 'default'
    }
  })
);
