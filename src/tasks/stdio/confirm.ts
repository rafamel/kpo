import { Empty, TypeGuard } from 'type-core';
import { shallow } from 'merge-strategies';
import { createInterface } from 'readline';
import { into } from 'pipettes';
import figures from 'figures';
import { Task } from '../../definitions';
import { isInteractive } from '../../utils/is-interactive';
import { isCancelled } from '../../utils/is-cancelled';
import { style } from '../../utils/style';
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
      into(
        ctx,
        print(
          style(figures(figures.pointer), { bold: true, color: 'yellow' }),
          ' ' + opts.message
        )
      );
      if (TypeGuard.isBoolean(opts.default)) {
        return series(
          log(
            'info',
            'Default selection [non-interactive]:',
            style(opts.default ? 'yes' : 'no', { bold: true })
          ),
          opts.default ? yes : no
        );
      }
      return raises(
        Error(`Must provide a default selection on non-interactive contexts`)
      );
    }

    const message = into(
      opts.message,
      (msg) => msg + (opts.default === true ? ' [Y/' : ' [y/'),
      (msg) => msg + (opts.default === false ? 'N]: ' : 'n]: '),
      (msg) => {
        return (
          style(figures(figures.pointer), { bold: true, color: 'yellow' }) +
          `  ${msg}`
        );
      }
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

            isCancelled(ctx).then((cancelled) => {
              if (cancelled) return resolve(null);
              into(ctx, log('error', 'Invalid response'));
              resolve(read());
            }, reject);
          });
        });
      })
    ]);

    readline.close();
    if (timeout) clearTimeout(timeout);
    if (response === null) into(ctx, print(''));
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
