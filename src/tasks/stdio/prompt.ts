import { Empty, TypeGuard, UnaryFn, VariadicFn } from 'type-core';
import { shallow } from 'merge-strategies';
import { createInterface } from 'readline';
import { Context, Task } from '../../definitions';
import { getBadge } from '../../helpers/badges';
import { addPrefix } from '../../helpers/prefix';
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
   * Default value.
   * Will be triggered on empty responses,
   * `timeout` expiration, and non-interactive contexts.
   */
  default?: string | null;
  /**
   * A timeout for the prompt.
   */
  timeout?: number;
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

    let response: null | string = null;
    while (!(await isCancelled(ctx))) {
      response = await line(
        addPrefix(opts.message + ' ', null, 'print', ctx),
        opts.timeout,
        ctx
      ).then((res) => {
        return res === '' && TypeGuard.isString(opts.default)
          ? opts.default
          : res;
      });

      /* Context was cancelled */
      if (await isCancelled(ctx)) return;

      /* Response is null. Context is not cancelled. Must be timeout. */
      if (response === null) break;

      /* Response is a string */
      let valid = false;
      let error: [Error] | null = null;
      try {
        valid = opts.validate(response);
      } catch (err) {
        error = [err];
      }

      if (valid && !error) {
        break;
      } else {
        response = null;
        await run(
          series(
            error ? log('trace', error[0]) : null,
            log(
              'error',
              error
                ? style(stringifyError(error[0]), { bold: true })
                : style('Invalid response', { bold: true })
            )
          ),
          ctx
        );
      }
    }

    /* Context was cancelled */
    if (await isCancelled(ctx)) return;

    /* Response is null. Context is not cancelled. Must be timeout. */
    if (response === null) {
      if (TypeGuard.isString(opts.default) && opts.validate(opts.default)) {
        await run(
          log('info', 'Timeout default:', style(opts.default, { bold: true })),
          ctx
        );
        response = opts.default;
      } else {
        throw Error(`Timeout: ${opts.timeout}ms`);
      }
    }

    /* Response is valid */
    const str = response;
    return context(
      (ctx) => ({
        ...ctx,
        args: [str, ...ctx.args]
      }),
      task
    );
  });
}

async function line(
  message: string,
  timeout: number,
  context: Context.Interactive
): Promise<string | null> {
  const stdin = context.stdio[0];
  const stdout = context.stdio[1];

  const readline = createInterface({
    input: stdin,
    output: stdout,
    terminal: stdout.isTTY
  });
  readline.setPrompt(message);
  readline.prompt();

  let timer: null | NodeJS.Timeout = null;
  let listener: null | VariadicFn = null;
  return new Promise<string | null>((resolve, reject) => {
    function close(write: boolean): void {
      readline.close();
      if (timer) clearTimeout(timer);
      if (listener) stdin.removeListener('keypress', listener);
      if (write) stdout.write('\n');
    }

    readline.on('line', (res) => {
      close(false);
      return resolve(res.replace(/\r?\n$/, ''));
    });
    readline.on('error', (err) => {
      close(true);
      return reject(err);
    });
    readline.on('SIGINT', () => {
      close(true);
      return reject(Error(`User cancellation`));
    });
    listener = (_, item) => {
      if (item && item.name === 'escape') {
        close(true);
        reject(Error(`User cancellation`));
      }
    };
    stdin.on('keypress', listener);
    context.cancellation.finally(() => {
      close(true);
      return resolve(null);
    });
    timer =
      timeout < 0
        ? null
        : setTimeout(() => {
            close(true);
            resolve(null);
          }, timeout);
  });
}
