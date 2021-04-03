import { Context } from '../definitions';
import { styleString } from './style-string';
import { stringifyRoute } from './stringify-route';
import { into } from 'pipettes';

export function getPrefix(
  extra: null | string,
  target: 'print' | 'exec',
  context: Context
): string {
  return into(
    context.route.length ? stringifyRoute(context.route) : '',
    (prefix) => {
      if (!prefix || (context.prefix !== target && context.prefix !== 'all')) {
        return extra ? extra + ' ' : null;
      }
      return (
        styleString(`${prefix} | `, { bold: true }) + (extra ? extra + ' ' : '')
      );
    },
    (prefix) => prefix || ''
  );
}

export function addPrefix(
  str: string,
  extra: null | string,
  target: 'print' | 'exec',
  context: Context
): string {
  const prefix = getPrefix(extra, target, context);

  return prefix
    ? str
        .split('\n')
        .map((x, i, arr) =>
          i === arr.length - 1 && !x.trim() ? x : prefix + x
        )
        .join('\n')
    : str;
}
