import { NullaryFn, UnaryFn, Empty } from 'type-core';
import { shallow } from 'merge-strategies';
import { into } from 'pipettes';
import chokidar from 'chokidar';
import debounce from 'debounce';

import { Task } from '../../definitions';
import { stringifyError } from '../../helpers/stringify';
import { run } from '../../utils/run';
import { log } from '../stdio/log';
import { clear } from '../stdio/clear';
import { create } from '../creation/create';
import { series } from '../aggregate/series';

export interface WatchOptions {
  /** Parse globs in paths */
  glob?: boolean;
  /** Runs the task once when ready to wait for changes */
  prime?: boolean;
  /** Finalizes the watch effort if a given task fails */
  fail?: boolean;
  /** Clear stdout before tasks execution */
  clear?: boolean;
  /** Paths to include */
  include?: string | string[];
  /** Paths to exclude */
  exclude?: string | string[];
  /** Doesn't cancel tasks in execution when a new task runs */
  parallel?: boolean;
  /** Avoids rapid task restarts by debouncing by a set number of ms */
  debounce?: number;
  /** Limits how many subdirectories will be traversed */
  depth?: number;
  /** If set, it will use polling every given ms interval */
  poll?: number;
  /** Whether to follow symlinks */
  symlinks?: boolean;
}

/**
 * Watches `paths` for changes and runs a given
 * `task` for every change event.
 * @returns Task
 */
export function watch(options: WatchOptions | Empty, task: Task): Task.Async {
  return create((ctx) => {
    const opts = into(
      {
        glob: false,
        prime: false,
        fail: false,
        clear: false,
        include: ['./'],
        exclude: ['node_modules'],
        parallel: false,
        debounce: -1,
        depth: -1,
        poll: -1,
        symlinks: false
      },
      (defaults) => shallow(defaults, options || undefined),
      ({ include, exclude, ...options }) => ({
        ...options,
        include: Array.isArray(include) ? include : [include],
        exclude: Array.isArray(exclude) ? exclude : [exclude]
      })
    );

    return series(log('debug', 'Watch:', opts.include), async () => {
      const watcher = chokidar.watch(opts.include, {
        persistent: true,
        ignored: opts.exclude,
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

      let i = -1;
      let current: Promise<void> = Promise.resolve();
      const onEvent = debounce(
        (onError: UnaryFn<Error>): void => {
          if (!opts.parallel) cancel();

          const after = opts.parallel ? Promise.resolve() : current;

          current = after
            .then(() => {
              i += 1;
              return run(
                {
                  ...ctx,
                  route: opts.parallel
                    ? ctx.route.concat(String(i))
                    : ctx.route,
                  cancellation: new Promise((resolve) => {
                    cbs.push(resolve);
                  })
                },
                series(i > 0 && opts.clear ? clear() : null, task)
              );
            })
            .catch((err) => {
              return opts.fail
                ? onError(err)
                : run(
                    ctx,
                    series(log('trace', err), log('error', stringifyError(err)))
                  );
            });
        },
        opts.debounce >= 0 ? opts.debounce : 0
      );

      const promises: Array<Promise<void>> = [];
      await new Promise<void>((resolve, reject) => {
        if (opts.prime) {
          watcher.on('ready', () => {
            promises.push(
              run(ctx, log('debug', 'Watch event:', 'prime')).catch(reject)
            );
            onEvent(reject);
          });
        }
        watcher.on('all', (event) => {
          promises.push(
            run(ctx, log('debug', 'Watch event:', event)).catch(reject)
          );
          onEvent(reject);
        });
        watcher.on('error', reject);
        ctx.cancellation.finally(resolve);
      }).finally(() => {
        watcher.close();
        cancel();
      });
      await Promise.all(promises);
    });
  });
}
