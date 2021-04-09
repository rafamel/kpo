import { Empty, TypeGuard } from 'type-core';
import { shallow } from 'merge-strategies';
import { Task } from '../../definitions';
import { run } from '../../utils/run';
import { isInteractive } from '../../utils/is-interactive';
import { create } from '../creation/create';
import { prompt } from './prompt';

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

    return prompt(
      {
        timeout: opts.timeout,
        default: TypeGuard.isBoolean(opts.default)
          ? opts.default
            ? 'yes'
            : 'no'
          : null,
        message: isInteractive(ctx)
          ? opts.message +
            (opts.default === true ? ' [Y/' : ' [y/') +
            (opts.default === false ? 'N]:' : 'n]:')
          : opts.message,
        validate: (str) => {
          return ['y', 'ye', 'yes', 'no', 'n'].includes(
            str.trim().toLowerCase()
          );
        }
      },
      async (ctx) => {
        const response = (ctx.args[0] || '').toLowerCase();
        const task = response[0] === 'y' ? yes : no;
        if (!task) return;
        await run(task, { ...ctx, args: ctx.args.slice(1) });
      }
    );
  });
}
