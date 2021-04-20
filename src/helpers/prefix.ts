import { TypeGuard } from 'type-core';
import { into } from 'pipettes';
import { Context } from '../definitions';
import { style } from '../utils/style';
import { stringifyPrintRoute } from './stringify';

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
      return style(`${prefix} | `, { bold: true }) + (extra ? extra + ' ' : '');
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
