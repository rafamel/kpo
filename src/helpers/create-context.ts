import process from 'node:process';

import { TypeGuard } from 'type-core';
import { into } from 'pipettes';

import type { Context } from '../definitions';
import { constants } from '../constants';

export function createContext(context?: Partial<Context>): Context {
  const controller = new AbortController();
  return into(
    context || {},
    (context) => ({
      cwd: context.cwd || process.cwd(),
      env:
        context.env ||
        Object.fromEntries(
          Object.entries(process.env).map(([key, value]) => [
            key,
            TypeGuard.isUndefined(value) ? null : value
          ])
        ),
      args: context.args || [],
      stdio: context.stdio || [process.stdin, process.stdout, process.stderr],
      level: context.level || constants.defaults.level,
      route: context.route || [],
      prefix: context.prefix || false,
      cancellation: context.cancellation || controller.signal
    }),
    (context) => Object.freeze(context)
  );
}
