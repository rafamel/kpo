// Default configuration file name
export const FILE_NAME = 'kpo.scripts';
// Default configuration file extensions
export const FILE_EXT = ['.js', '.json', '.yml', '.yaml'];
// Default logging level
export const DEFAULT_LOG_LEVEL = 'info';
// Default stdio for spawned commands
export const DEFAULT_STDIO = 'inherit';
// Concurrently path
export const CONCURRENTLY_PATH = require.resolve(
  'concurrently/bin/concurrently'
);
