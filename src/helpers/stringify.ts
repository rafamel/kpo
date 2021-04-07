import { splitBy } from 'cli-belt';
import { ensure } from 'errorish';
import { into } from 'pipettes';
import { style } from '../utils/style';
import { constants } from '../constants';

export function stringifyKeyRoute(route: string[]): string {
  return route.join(':');
}

export function stringifyPrintRoute(route: string[]): string {
  return route.filter((str) => str !== constants.defaults.task).join(':');
}

export function stringifyArgvCommands(argv: string[]): string {
  const [first] = splitBy(argv, '--');
  return first.filter((str) => str[0] !== '-').join(' ');
}

export function stringifyError(error: Error): string {
  return into(
    ensure(error, null, { normalize: true }).message,
    (msg) => msg[0].toUpperCase() + msg.slice(1).toString(),
    (msg) => style(msg, { bold: true })
  );
}
