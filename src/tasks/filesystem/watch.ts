import { Task, Context } from '../../definitions';
import { run } from '../../utils/run';
import { log } from '../stdio/log';
import { NullaryFn, UnaryFn, Empty } from 'type-core';
import { into, combine } from 'pipettes';
import chokidar from 'chokidar';
import debounce from 'debounce';

export interface WatchOptions {
  glob?: boolean;
  initial?: boolean;
  parallel?: boolean;
  debounce?: number;
  depth?: number;
  poll?: number;
  symlinks?: boolean;
}

export function watch(
  paths: string | string[],
  options: WatchOptions | Empty,
  task: Task
): Task.Async {
  return async (ctx: Context): Promise<void> => {
    into(ctx, log('debug', 'Watch:', paths));

    const opts = Object.assign(
      {
        glob: false,
        initial: false,
        parallel: false,
        debounce: -1,
        depth: -1,
        poll: -1,
        symlinks: false
      },
      options
    );

    const watcher = chokidar.watch(paths, {
      persistent: true,
      ignorePermissionErrors: false,
      ignoreInitial: true,
      cwd: ctx.cwd,
      disableGlobbing: !opts.glob,
      depth: opts.depth >= 0 ? opts.depth : undefined,
      usePolling: opts.poll >= 0,
      interval: opts.poll,
      binaryInterval: opts.poll,
      followSymlinks: opts.symlinks
    });

    const cbs: NullaryFn[] = [];
    function cancel(): void {
      while (cbs.length) {
        const cb = cbs.shift();
        if (cb) cb();
      }
    }
    function close(): void {
      watcher.close();
      cancel();
    }

    let i = 0;
    let current: Promise<void> = Promise.resolve();
    const onEvent = debounce(
      (onError: UnaryFn<Error>): void => {
        if (!opts.parallel) cancel();

        const after = opts.parallel ? Promise.resolve() : current;

        current = after
          .then(() => {
            return run(task, {
              ...ctx,
              route: opts.parallel ? ctx.route.concat(i++) : ctx.route,
              cancellation: new Promise((resolve) => {
                cbs.push(resolve);
              })
            });
          })
          .catch(onError);
      },
      opts.debounce >= 0 ? opts.debounce : 0
    );

    return new Promise((resolve, reject) => {
      if (opts.initial) {
        watcher.on('ready', () => {
          into(ctx, log('debug', 'Watch event:', 'initial'));
          onEvent(combine(close, reject));
        });
      }
      watcher.on('all', (event) => {
        into(ctx, log('debug', 'Watch event:', event));
        onEvent(combine(close, reject));
      });
      watcher.on('error', combine(close, reject));
      ctx.cancellation.finally(combine(close, resolve));
    });
  };
}