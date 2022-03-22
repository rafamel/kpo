import { Task, Context } from '../../definitions';

/**
 * Clears stdout when a TTY
 * @returns Task
 */
export function clear(): Task.Sync {
  return (ctx: Context): void => {
    const stdout = ctx.stdio[1];

    if (!stdout) return;
    if (!(stdout as NodeJS.WriteStream).isTTY) return;
    if (ctx.env.TERM === 'dumb') return;

    stdout.write('\u001Bc');
  };
}
