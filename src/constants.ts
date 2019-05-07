// Default configuration file name
export const FILE_NAME = 'kpo.scripts';
// Default configuration file extensions
export const FILE_EXT = ['.js', '.json', '.yml', '.yaml'];
// Default logging level
export const DEFAULT_LOG_LEVEL = 'info';
// Default stdio for spawned commands
export const DEFAULT_STDIO = 'inherit';
// Node binary path
export const NODE_PATH = process.execPath;
// Kpo bin path
export const KPO_PATH = require.resolve('./bin/kpo');
// Concurrently path
export const CONCURRENTLY_PATH = require.resolve(
  'concurrently/bin/concurrently'
);
/* Shared between instances: changes might imply a major version release */
export type TEnvironmental = 'kpo_log';
