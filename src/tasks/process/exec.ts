import { Empty } from 'type-core';
import { shallow } from 'merge-strategies';
import transform from 'prefix-stream';
import { WriteStream } from 'tty';
import execa from 'execa';
import path from 'path';
import { Task } from '../../definitions';
import { run } from '../../utils/run';
import { getPrefix } from '../../helpers/prefix';
import { series } from '../aggregate/series';
import { create } from '../creation/create';
import { log } from '../stdio/log';

export type ExecOptions = execa.Options;

/**
 * Spawns a process.
 * When no file is passed, it will execute node.
 * @returns Task
 */
export function exec(
  file: string | null,
  args?: string[] | Empty,
  options?: ExecOptions | Empty,
  cb?: (ps: execa.ExecaChildProcess) => void
): Task.Async {
  return create(async (ctx) => {
    const fullArgs = (args || []).concat(ctx.args || []);
    return series(
      log('debug', `Exec: ${file}`, fullArgs.length ? fullArgs : undefined),
      async () => {
        const opts = shallow(
          {
            cwd: ctx.cwd,
            localDir: ctx.cwd,
            execPath: process.execPath,
            extendEnv: true,
            preferLocal: true
          },
          options || undefined
        );

        const isStdioTty =
          ctx.stdio[1] instanceof WriteStream ||
          ctx.stdio[2] instanceof WriteStream;
        const prefix = getPrefix(null, 'exec', ctx);
        const pipeOutput = !opts.stdio && prefix;
        const forceColor = pipeOutput && isStdioTty;

        const ps = execa(file || opts.execPath, fullArgs, {
          ...opts,
          extendEnv: false,
          env: Object.assign(
            forceColor ? { FORCE_COLOR: true } : {},
            opts.extendEnv ? ctx.env : undefined,
            opts.env
          ),
          stdio: opts.stdio || [
            ctx.stdio[0] || 'ignore',
            pipeOutput ? 'pipe' : ctx.stdio[1] || 'ignore',
            pipeOutput ? 'pipe' : ctx.stdio[2] || 'ignore'
          ]
        });
        if (pipeOutput) {
          if (ps.stdout && ctx.stdio[1]) {
            ps.stdout.pipe(transform(prefix)).pipe(ctx.stdio[1]);
          }
          if (ps.stderr && ctx.stdio[2]) {
            ps.stderr.pipe(transform(prefix)).pipe(ctx.stdio[2]);
          }
        }

        if (cb) cb(ps);

        let cancelled = false;
        ctx.cancellation.finally(() => {
          cancelled = true;
          ps.cancel();
        });

        await ps.catch(async (err) => {
          if (cancelled) return undefined;

          let message = 'Command failed';
          if (err.exitCode) {
            message += ' with exit code ' + err.exitCode;
          } else if ((err as NodeJS.ErrnoException).code) {
            message += ' with ' + (err as NodeJS.ErrnoException).code;
          }

          const cmd = file || fullArgs.filter((arg) => arg[0] !== '-')[0];
          message += !cmd || cmd.includes(path.sep) ? '' : `: ${cmd}`;

          await run(log('trace', err), ctx);
          throw Error(message);
        });
      }
    );
  });
}
