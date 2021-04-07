import { Context } from '../definitions';
import { constants } from '../constants';
import { into } from 'pipettes';
import { TypeGuard } from 'type-core';

const cancellation = new Promise<void>(() => undefined);

export function createContext(context?: Partial<Context>): Context {
  return into(
    context || {},
    (context) => ({
      cwd: context.cwd || process.cwd(),
      env: context.env || { ...process.env },
      args: context.args || [],
      stdio: context.stdio || [process.stdin, process.stdout, process.stderr],
      level: context.level || constants.defaults.level,
      route: context.route || [],
      prefix: context.prefix || false,
      interactive: TypeGuard.isUndefined(context.interactive)
        ? true
        : context.interactive,
      cancellation: context.cancellation
        ? context.cancellation.then(() => undefined)
        : cancellation
    }),
    (context) => Object.freeze(context)
  );
}
