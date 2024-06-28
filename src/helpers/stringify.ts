import { splitBy } from 'cli-belt';
import { ensure } from 'errorish';

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
  const msg = ensure(error, null, { normalize: true }).message;
  return style(msg, { bold: true });
}
