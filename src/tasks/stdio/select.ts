import { Empty, Members, TypeGuard } from 'type-core';
import { shallow } from 'merge-strategies';
import cliSelect from 'cli-select';
import { into } from 'pipettes';
import figures from 'figures';
import { Task } from '../../definitions';
import { styleString } from '../../helpers/style-string';
import { emitterIntercept } from '../../helpers/emitter-intercept';
import { isInteractive } from '../../utils/is-interactive';
import { isCancelled } from '../../utils/is-cancelled';
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

export function select(
  options: SelectOptions | Empty,
  tasks: Members<Task | Empty>
): Task.Async {
  return create(async (ctx) => {
    const opts = shallow(
      {
        message: 'Select to continue:',
        timeout: -1,
        default: null as string | null
      },
      options || undefined
    );

    const names = Object.keys(tasks);
    const fallback: number = TypeGuard.isString(opts.default)
      ? names.indexOf(opts.default)
      : -1;

    if (!isInteractive(ctx)) {
      if (fallback >= 0 && opts.default) {
        return series(
          log('info', 'Default selection [non-interactive]:', opts.default),
          tasks[opts.default]
        );
      }
      return raises(
        Error(`Must provide a default selection for non-interactive contexts`)
      );
    }

    into(
      ctx,
      print(styleString(figures(figures.pointer)) + ' ' + opts.message, {
        bold: true,
        color: 'yellow'
      })
    );

    const { emitter, emit } = emitterIntercept(ctx.stdio[0]);

    function cancel(): void {
      return emit('keypress', {
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

    ctx.cancellation.finally(() => {
      if (timeout) clearTimeout(timeout);
      cancel();
    });

    const response = await cliSelect({
      cleanup: true,
      values: names,
      ...(fallback >= 0 ? { defaultValue: fallback } : {}),
      selected: figures(figures.circleFilled),
      unselected: figures(figures.circle),
      indentation: 2,
      outputStream: ctx.stdio[2] as NodeJS.WriteStream,
      inputStream: Object.create(emitter, {
        setRawMode: {
          value(...args: any[]) {
            return (emitter as any).setRawMode
              ? (emitter as any).setRawMode.apply(this, args)
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
      return series(log('info', 'Select:', response), tasks[response]);
    }
    // No response and no timeout triggered
    if (!didTimeout) return raises(Error(`User cancellation`));
    // No response and timeout triggered with a default selection available
    if (fallback >= 0 && opts.default) {
      return series(
        log('info', 'Default selection [timeout]:', opts.default),
        tasks[opts.default]
      );
    }
    // No response and timeout triggered without a default selection available
    return raises(Error(`Select timeout: ${opts.timeout}ms`));
  });
}
