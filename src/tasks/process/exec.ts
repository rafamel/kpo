import { Task, Context } from '../../definitions';
import { getPrefix } from '../../helpers/prefix';
import { log } from '../stdio/log';
import { Empty } from 'type-core';
import { shallow } from 'merge-strategies';
import transform from 'prefix-stream';
import { WriteStream } from 'tty';
import { into } from 'pipettes';
import execa from 'execa';

export interface ExecOptions extends execa.Options {
  /**
   * Produces a brief error message with only the exit code.
   */
  briefError?: boolean;
}

/**
 * Spawns a process.
 * @returns Task
 */
export function exec(
  file: string,
  args?: string[] | Empty,
  options?: ExecOptions | Empty,
  cb?: (ps: execa.ExecaChildProcess) => void
): Task.Async {
  const opts = shallow({ extendEnv: true }, options || undefined);
  return async (ctx: Context): Promise<void> => {
    const fullArgs = (args || []).concat(ctx.args || []);

    into(
      ctx,
      log('debug', `Exec: ${file}`, fullArgs.length ? fullArgs : undefined)
    );

    const isStdioTty =
      ctx.stdio[1] instanceof WriteStream ||
      ctx.stdio[2] instanceof WriteStream;
    const prefix = getPrefix(null, 'exec', ctx);
    const pipeOutput = !opts.stdio && prefix;
    const forceColor = pipeOutput && isStdioTty;

    const ps = execa(file, fullArgs, {
      ...options,
      extendEnv: false,
      cwd: opts.cwd || ctx.cwd,
      env: Object.assign(
        forceColor ? { FORCE_COLOR: true } : {},
        opts.extendEnv ? ctx.env : undefined,
        opts.env
      ),
      stdio: opts.stdio || [
        ctx.stdio[0],
        pipeOutput ? 'pipe' : ctx.stdio[1],
        pipeOutput ? 'pipe' : ctx.stdio[2]
      ]
    });

    if (pipeOutput) {
      if (ps.stdout) {
        ps.stdout.pipe(transform(prefix)).pipe(ctx.stdio[1]);
      }
      if (ps.stderr) {
        ps.stderr.pipe(transform(prefix)).pipe(ctx.stdio[2]);
      }
    }

    if (cb) cb(ps);

    let cancelled = false;
    ctx.cancellation.finally(() => {
      cancelled = true;
      ps.cancel();
    });

    let exitCode: number | null = null;
    ps.on('exit', (code) => (exitCode = code));

    return ps.then(
      () => undefined,
      (err) => {
        if (cancelled) return undefined;

        if (opts.briefError) {
          err.message =
            `Command failed` + (exitCode ? ` with exit code ${exitCode}` : '');
        }
        return Promise.reject(err);
      }
    );
  };
}
