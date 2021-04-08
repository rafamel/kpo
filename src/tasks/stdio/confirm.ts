import { Empty, TypeGuard } from 'type-core';
import { shallow } from 'merge-strategies';
import { createInterface } from 'readline';
import { into } from 'pipettes';
import { Task } from '../../definitions';
import { getBadge } from '../../helpers/badges';
import { isInteractive } from '../../utils/is-interactive';
import { isCancelled } from '../../utils/is-cancelled';
import { style } from '../../utils/style';
import { run } from '../../utils/run';
import { series } from '../aggregate/series';
import { raises } from '../exception/raises';
import { create } from '../creation/create';
import { print } from '../stdio/print';
import { log } from '../stdio/log';

export interface ConfirmOptions {
  /**
   * A message to prompt.
   */
  message?: string;
  /**
   * A timeout for the confirm.
   */
  timeout?: number;
  /**
   * Default selection.
   * `true` for yes, `false` for no.
   * Will be triggered on `timeout` expiration
   * and non-interactive contexts.
   */
  default?: boolean | null;
}

/**
 * Uses a context's stdio to prompt for confirmation.
 * @returns Task
 */
export function confirm(
  options: ConfirmOptions | Empty,
  yes: Task | Empty,
  no: Task | Empty
): Task.Async {
  return create(async (ctx) => {
    const opts = shallow(
      {
        message: 'Continue?',
        timeout: -1,
        default: null as string | null
      },
      options || undefined
    );

    if (!isInteractive(ctx)) {
      const message = getBadge('prompt') + ` ${opts.message}`;
      return TypeGuard.isBoolean(opts.default)
        ? series(
            print(message),
            log(
              'info',
              'Default selection [non-interactive]:',
              style(opts.default ? 'yes' : 'no', { bold: true })
            ),
            opts.default ? yes : no
          )
        : series(
            print(message),
            raises(
              Error(
                `Must provide a default selection on non-interactive contexts`
              )
            )
          );
    }

    const message = into(
      opts.message,
      (msg) => msg + (opts.default === true ? ' [Y/' : ' [y/'),
      (msg) => msg + (opts.default === false ? 'N]: ' : 'n]: '),
      (msg) => getBadge('prompt') + ` ${msg}`
    );

    const readline = createInterface({
      input: ctx.stdio[0],
      output: ctx.stdio[1]
    });

    let timeout: null | NodeJS.Timeout = null;
    const response = await Promise.race([
      new Promise<null>((resolve) => {
        ctx.cancellation.finally(() => resolve(null));
        timeout =
          opts.timeout < 0
            ? null
            : setTimeout(() => resolve(null), opts.timeout);
      }),
      into(null, function read() {
        return new Promise<boolean | null>((resolve, reject) => {
          readline.question(message, (res) => {
            const str = res.trim().toLowerCase();
            if (['y', 'ye', 'yes'].includes(str)) {
              return resolve(true);
            }
            if (['n', 'no'].includes(str)) {
              return resolve(false);
            }
            if (!str && TypeGuard.isBoolean(opts.default)) {
              return resolve(opts.default);
            }

            isCancelled(ctx).then(
              async (cancelled) => {
                if (cancelled) return resolve(null);
                await run(log('error', 'Invalid response'), ctx);
                resolve(read());
              },
              (err) => reject(err)
            );
          });
        });
      })
    ]);

    readline.close();
    if (timeout) clearTimeout(timeout);
    if (response === null) ctx.stdio[1].write('\n');
    if (await isCancelled(ctx)) return;

    // Explicit response by user
    if (response !== null) return response ? yes : no;

    // No response and timeout triggered with a default selection available
    if (TypeGuard.isBoolean(opts.default)) {
      return series(
        log(
          'info',
          'Default selection [timeout]:',
          style(opts.default ? 'yes' : 'no', { bold: true })
        ),
        opts.default ? yes : no
      );
    }
    // No response and timeout triggered without a default selection available
    return raises(Error(`Confirm timeout: ${opts.timeout}ms`));
  });
}
