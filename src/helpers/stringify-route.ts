import { constants } from '../constants';

export function stringifyPrintRoute(route: string[]): string {
  return route.filter((str) => str !== constants.record.default).join(':');
}

export function stringifyKeyRoute(route: string[]): string {
  return route.join(':');
}
