import { Empty, Members, TypeGuard } from 'type-core';
import { shallow } from 'merge-strategies';
import { Transform } from 'stream';
import cliSelect from 'cli-select';
import { Task } from '../../definitions';
import { getBadge } from '../../helpers/badges';
import { addPrefix } from '../../helpers/prefix';
import { emitterIntercept } from '../../helpers/emitter-intercept';
import { isInteractive } from '../../utils/is-interactive';
import { isCancelled } from '../../utils/is-cancelled';
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
 * Takes in a record of `tasks`.
 * @returns Task
 */
export function select(
  options: SelectOptions | Empty,
  tasks: Members<Task | Empty>
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

    const names = Object.keys(tasks);
    const fallback: number = TypeGuard.isString(opts.default)
      ? names.indexOf(opts.default)
      : -1;
    const message = getBadge('prompt') + ` ${opts.message}`;

    await run(print(message), ctx);
    if (await isCancelled(ctx)) return;

    if (!isInteractive(ctx)) {
      return fallback >= 0 && opts.default
        ? series(
            log(
              'info',
              'Default selection [non-interactive]:',
              style(opts.default, { bold: true })
            ),
            tasks[opts.default]
          )
        : raises(
            Error(
              `Must provide a default selection for non-interactive contexts`
            )
          );
    }

    const stdout = ctx.stdio[1];
    const stdin = new Transform().pipe(ctx.stdio[0], { end: false });
    const intercept = emitterIntercept(stdin);

    function cancel(): void {
      intercept.emit('keypress', {
        sequence: '\u001b',
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

    ctx.cancellation.finally(() => cancel());

    const response = await cliSelect({
      cleanup: true,
      values: names,
      ...(fallback >= 0 ? { defaultValue: fallback } : {}),
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
      });

    if (timeout) clearTimeout(timeout);
    if (await isCancelled(ctx)) return;

    // Explicit response by user
    if (response !== null) {
      return series(
        log('info', 'Select:', style(response, { bold: true })),
        tasks[response]
      );
    }
    // No response and no timeout triggered
    if (!didTimeout) throw Error(`User cancellation`);
    // No response and timeout triggered with a default selection available
    if (fallback >= 0 && opts.default) {
      return series(
        log(
          'info',
          'Default selection [timeout]:',
          style(opts.default, { bold: true })
        ),
        tasks[opts.default]
      );
    }
    // No response and timeout triggered without a default selection available
    throw Error(`Select timeout: ${opts.timeout}ms`);
  });
}
