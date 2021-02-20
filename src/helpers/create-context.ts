import { Context } from '../definitions';
import { into } from 'pipettes';

const cancellation = new Promise<void>(() => undefined);

export function createContext(context?: Partial<Context>): Context {
  return into(
    context || {},
    (context) => ({
      cwd: context.cwd || process.cwd(),
      env: context.env || { ...process.env },
      args: context.args || [],
      stdio: context.stdio || [process.stdin, process.stdout, process.stderr],
      level: context.level || 'info',
      route: context.route || [],
      prefix: context.prefix || 'none',
      cancellation: context.cancellation
        ? context.cancellation.then(() => undefined)
        : cancellation
    }),
    (context) => Object.freeze(context)
  );
}
