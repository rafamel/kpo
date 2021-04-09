import { Empty, TypeGuard, UnaryFn } from 'type-core';
import { shallow } from 'merge-strategies';
import { createInterface } from 'readline';
import { into } from 'pipettes';
import { Task } from '../../definitions';
import { getBadge } from '../../helpers/badges';
import { stringifyError } from '../../helpers/stringify';
import { isInteractive } from '../../utils/is-interactive';
import { isCancelled } from '../../utils/is-cancelled';
import { style } from '../../utils/style';
import { run } from '../../utils/run';
import { context } from '../creation/context';
import { create } from '../creation/create';
import { series } from '../aggregate/series';
import { raises } from '../exception/raises';
import { print } from '../stdio/print';
import { log } from '../stdio/log';

export interface PromptOptions {
  /**
   * A message to prompt.
   */
  message?: string;
  /**
   * A timeout for the prompt.
   */
  timeout?: number;
  /**
   * Default value.
   * Will be triggered on empty responses,
   * `timeout` expiration, and non-interactive contexts.
   */
  default?: string | null;
  /**
   * Tests the validity of a response.
   * Returns `true` for valid responses,
   * `false` for non-valid ones.
   */
  validate?: UnaryFn<string, boolean>;
}

/**
 * Uses a context's stdio to prompt for a user response.
 * The response will be prepended to the context arg array
 * for `task`, when valid.
 * @returns Task
 */
export function prompt(options: PromptOptions | Empty, task: Task): Task.Async {
  return create(async (ctx) => {
    const opts = shallow(
      {
        message: 'Continue:',
        timeout: -1,
        default: null as string | null,
        validate: () => true
      },
      options || undefined
    );

    const message = getBadge('prompt') + ` ${opts.message} `;
    if (!isInteractive(ctx)) {
      return TypeGuard.isString(opts.default) && opts.validate(opts.default)
        ? series(
            print(message),
            log(
              'info',
              'Non-interactive default:',
              style(opts.default, { bold: true })
            ),
            context(
              (ctx) => ({ ...ctx, args: [opts.default || '', ...ctx.args] }),
              task
            )
          )
        : series(
            print(message),
            raises(Error(`Must provide a default for non-interactive contexts`))
          );
    }

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
        return new Promise<string | null>((resolve, reject) => {
          readline.question(message, (res) => {
            let valid = false;
            let error: [Error] | null = null;
            const response =
              !res && TypeGuard.isString(opts.default) ? opts.default : res;
            try {
              valid = opts.validate(response);
            } catch (err) {
              error = [err];
            }
            isCancelled(ctx).then(
              async (cancelled) => {
                if (cancelled) return resolve(null);
                if (valid) return resolve(response);
                await run(
                  series(
                    error ? log('trace', error[0]) : null,
                    log(
                      'error',
                      error ? stringifyError(error[0]) : 'Invalid response'
                    )
                  ),
                  ctx
                );
                if (await isCancelled(ctx)) return resolve(null);
                return resolve(read());
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
    if (response !== null) {
      return context(
        (ctx) => ({ ...ctx, args: [response, ...ctx.args] }),
        task
      );
    }

    // No response and timeout triggered with a default available
    if (TypeGuard.isString(opts.default) && opts.validate(opts.default)) {
      return series(
        log('info', 'Timeout default:', style(opts.default, { bold: true })),
        context(
          (ctx) => ({ ...ctx, args: [opts.default || '', ...ctx.args] }),
          task
        )
      );
    }
    // No response and timeout triggered without a default available
    throw Error(`Timeout: ${opts.timeout}ms`);
  });
}
