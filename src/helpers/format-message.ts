import { ensure } from 'errorish';
import { into } from 'pipettes';
import chalk from 'chalk';

export function formatMessage(error: Error): string {
  return into(
    ensure(error, null, { normalize: true }).message,
    (msg) => msg[0].toUpperCase() + msg.slice(1).toString(),
    (msg) => chalk.bold(msg)
  );
}
