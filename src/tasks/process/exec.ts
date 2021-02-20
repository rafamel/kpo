import { Task, Context } from '../../definitions';
import { getPrefix } from '../../helpers/prefix';
import { log } from '../stdio/log';
import { Empty } from 'type-core';
import { WriteStream } from 'tty';
import { into } from 'pipettes';
import transform from 'prefix-stream';
import execa from 'execa';

/**
 * Spawns a process.
 * @returns Task
 */
export function exec(
  file: string,
  args?: string[] | Empty,
  options?: execa.Options | Empty,
  cb?: (ps: execa.ExecaChildProcess) => void
): Task.Async {
  const opts = Object.assign({ extendEnv: true }, options || undefined);
  return async (ctx: Context): Promise<void> => {
    into(
      ctx,
      log('debug', `Exec: ${file}`, args && args.length ? args : undefined)
    );

    const isStdioTty =
      ctx.stdio[1] instanceof WriteStream ||
      ctx.stdio[2] instanceof WriteStream;
    const prefix = getPrefix(null, 'exec', ctx);
    const pipeOutput = !opts.stdio && prefix;
    const forceColor = pipeOutput && isStdioTty;

    const ps = execa(file, (args || []).concat(ctx.args), {
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

    return ps.then(
      () => undefined,
      (err) => (cancelled ? undefined : Promise.reject(err))
    );
  };
}
