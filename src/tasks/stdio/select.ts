import { Transform } from 'node:stream';

import type { Empty, MaybePromise } from 'type-core';
import { shallow } from 'merge-strategies';
import cliSelect from 'cli-select';

import type { Task } from '../../definitions';
import { getBadge } from '../../helpers/badges';
import { addPrefix } from '../../helpers/prefix';
import { emitterIntercept } from '../../helpers/emitter-intercept';
import { isInteractive } from '../../utils/is-interactive';
import { isCancelled, onCancel } from '../../utils/cancellation';
import { style } from '../../utils/style';
import { run } from '../../utils/run';
import { series } from '../aggregate/series';
import { raises } from '../exception/raises';
import { create } from '../creation/create';
import { print } from './print';
import { log } from './log';

export interface SelectOptions {
  /**
   * A message to prompt.
   */
  message?: string;
  /**
   * A default selection.
   * Will be triggered on `timeout` expiration
   * and non-interactive contexts.
   */
  default?: string | null;
  /**
   * A timeout for the select.
   */
  timeout?: number;
}

/**
 * Uses a context's stdio to prompt for input.
 * Offers `values` to select from and passes the
 * user `selection` to a `Task` returning `callback`.
 * @returns Task
 */
export function select(
  options: SelectOptions | Empty,
  values: string[],
  callback: (selection: string) => MaybePromise<Task | Empty>
): Task.Async {
  return create(async (ctx) => {
    const opts = shallow(
      {
        message: 'Select to continue',
        timeout: -1,
        default: null as string | null
      },
      options || undefined
    );

    const names = Object.keys(values);
    const message = getBadge('prompt') + ` ${opts.message}`;

    await run(ctx, print(message));
    if (isCancelled(ctx)) return;

    if (!isInteractive(ctx)) {
      const value = opts.default;
      return value
        ? series(
            log(
              'info',
              'Default selection [non-interactive]:',
              style(value, { bold: true })
            ),
            create(() => callback(value))
          )
        : raises(
            new Error(
              `Must provide a default selection for non-interactive contexts`
            )
          );
    }

    const stdout = ctx.stdio[1];
    const stdin = new Transform().pipe(ctx.stdio[0], { end: false });
    const intercept = emitterIntercept(stdin);

    function cancel(): void {
      intercept.emit('keypress', {
        sequence: '\u001B',
        name: 'escape',
        ctrl: false,
        meta: true,
        shift: false
      });
    }

    let didTimeout = false;
    const timeout =
      opts.timeout < 0
        ? null
        : setTimeout(() => (didTimeout = true) && cancel(), opts.timeout);

    const cleanup = onCancel(ctx, () => cancel());
    const response = await cliSelect({
      cleanup: true,
      values: names,
      ...(opts.default ? { defaultValue: names.indexOf(opts.default) } : {}),
      selected: addPrefix(getBadge('selected'), ' '.repeat(3), 'print', ctx),
      unselected: addPrefix(
        getBadge('unselected'),
        ' '.repeat(3),
        'print',
        ctx
      ),
      indentation: 0,
      outputStream: stdout,
      inputStream: Object.create(intercept.emitter, {
        setRawMode: {
          value(...args: any[]) {
            return (intercept.emitter as any).setRawMode
              ? (intercept.emitter as any).setRawMode.apply(this, args)
              : () => undefined;
          }
        }
      })
    })
      .then(
        // User selection
        ({ value }) => value,
        // User cancellation
        () => null
      )
      .finally(() => {
        intercept.clear();
        stdin.end();
        cleanup();
        if (timeout) clearTimeout(timeout);
      });

    if (isCancelled(ctx)) return;

    // Explicit response by user
    if (response !== null) {
      return series(
        log('info', 'Select:', style(response, { bold: true })),
        create(() => callback(response))
      );
    }

    // No response and no timeout triggered
    if (!didTimeout) throw new Error(`User cancellation`);

    // No response and timeout triggered with a default selection available
    const value = opts.default;
    if (value) {
      return series(
        log(
          'info',
          'Default selection [timeout]:',
          style(value, { bold: true })
        ),
        create(() => callback(value))
      );
    }

    // No response and timeout triggered without a default selection available
    throw new Error(`Select timeout: ${opts.timeout}ms`);
  });
}
