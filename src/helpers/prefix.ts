import { Context } from '../definitions';
import { styleString } from './style-string';
import { stringifyPrintRoute } from './stringify';
import { into } from 'pipettes';
import { TypeGuard } from 'type-core';

export function getPrefix(
  extra: null | string,
  target: 'print' | 'exec',
  context: Context
): string {
  return into(
    {
      prefix: context.route.length ? stringifyPrintRoute(context.route) : '',
      policy: TypeGuard.isString(context.prefix)
        ? context.prefix
        : context.prefix
        ? 'all'
        : 'none'
    },
    ({ prefix, policy }) => {
      if (!prefix || (policy !== target && policy !== 'all')) {
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
