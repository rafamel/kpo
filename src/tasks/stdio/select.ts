import { Empty, Members, TypeGuard } from 'type-core';
import { shallow } from 'merge-strategies';
import cliSelect from 'cli-select';
import { into } from 'pipettes';
import figures from 'figures';
import { Task } from '../../definitions';
import { isInteractive } from '../../utils/is-interactive';
import { isCancelled } from '../../utils/is-cancelled';
import { style } from '../../utils/style';
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
   * A timeout for the select.
   */
  timeout?: number;
  /**
   * A default selection.
   * Will be triggered on `timeout` expiration
   * and non-interactive contexts.
   */
  default?: string | null;
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

    into(
      ctx,
      print(
        style(figures(figures.pointer), { bold: true, color: 'yellow' }),
        ' ' + opts.message
      )
    );

    const names = Object.keys(tasks);
    const fallback: number = TypeGuard.isString(opts.default)
      ? names.indexOf(opts.default)
      : -1;

    if (!isInteractive(ctx)) {
      if (fallback >= 0 && opts.default) {
        return series(
          log(
            'info',
            'Default selection [non-interactive]:',
            style(opts.default, { bold: true })
          ),
          tasks[opts.default]
        );
      }
      return raises(
        Error(`Must provide a default selection for non-interactive contexts`)
      );
    }

    const stdin = ctx.stdio[0];
    function cancel(): void {
      stdin.emit('keypress', undefined, {
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
      selected: figures(figures.circleFilled),
      unselected: figures(figures.circle),
      indentation: 4,
      outputStream: ctx.stdio[2] as NodeJS.WriteStream,
      inputStream: Object.create(stdin, {
        setRawMode: {
          value(...args: any[]) {
            return (stdin as any).setRawMode
              ? (stdin as any).setRawMode.apply(this, args)
              : () => undefined;
          }
        }
      })
    }).then(
      // User selection
      ({ value }) => value,
      // User cancellation
      () => null
    );

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
    if (!didTimeout) return raises(Error(`User cancellation`));
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
    return raises(Error(`Select timeout: ${opts.timeout}ms`));
  });
}
