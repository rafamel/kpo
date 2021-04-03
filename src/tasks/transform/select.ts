import { Task, Context } from '../../definitions';
import { isCancelled } from '../../utils/is-cancelled';
import { run } from '../../utils/run';
import { print } from '../stdio/print';
import { log } from '../stdio/log';
import { Members, Empty } from 'type-core';
import { shallow } from 'merge-strategies';
import { createInterface } from 'readline';
import { into } from 'pipettes';

export interface SelectOptions {
  /**
   * A message to prompt for option selection.
   * Default: `'Continue'`
   */
  message?: string;
  /**
   * A timeout for the select.
   * Will cause the `default`, if available,
   * to be selected when expired.
   */
  timeout?: number;
  /**
   * A default selection.
   * Will be triggered on `timeout`
   * expiration and on empty responses.
   */
  default?: string | null;
}

/**
 * Uses a context's stdout to prompt for input.
 * Takes in a record of `tasks`, which keys
 * will represent the required user input
 * to select one of them for execution.
 * @returns Task
 */
export function select(
  options: SelectOptions | Empty,
  tasks: Members<Task | Empty>
): Task.Async {
  const opts = shallow(
    {
      message: 'Continue?',
      timeout: -1,
      default: null as string | null
    },
    options || undefined
  );

  const lowercaseDefault =
    typeof opts.default === 'string' ? opts.default.toLowerCase() : null;

  const names = Object.keys(tasks || {});
  const lowercaseNames = names
    .map((x) => x.toLowerCase())
    .filter((x, i, arr) => arr.indexOf(x) === i);

  if (names.length !== lowercaseNames.length) {
    throw Error(`Prompt names collision`);
  }

  const message =
    opts.message +
    (names.length
      ? ' [' +
        lowercaseNames
          .map((name): string => {
            return lowercaseDefault === name
              ? name[0].toUpperCase() + name.slice(1)
              : name;
          })
          .join('/') +
        ']: '
      : ': ');

  return async (ctx: Context): Promise<void> => {
    const readline = createInterface({
      input: ctx.stdio[0],
      output: ctx.stdio[1]
    });

    let timeout: NodeJS.Timeout | null = null;
    ctx.cancellation.finally(() => {
      readline.close();
      if (timeout) clearTimeout(timeout);
    });

    const response = await Promise.race([
      into(null, function read() {
        return new Promise<string>((resolve, reject) => {
          readline.question(message, (res) => {
            const str = res.trim().toLowerCase();
            if (
              !str &&
              lowercaseDefault &&
              lowercaseNames.includes(lowercaseDefault)
            ) {
              return resolve(lowercaseDefault);
            }

            if (lowercaseNames.includes(str)) {
              return resolve(str);
            }

            isCancelled(ctx).then((cancelled) => {
              if (cancelled) return resolve('');
              into(ctx, log('error', 'Invalid response'));
              resolve(read());
            }, reject);
          });
        });
      }),
      new Promise<string>((resolve, reject) => {
        if (opts.timeout < 0) return;

        timeout = setTimeout(() => {
          readline.close();
          if (lowercaseDefault && lowercaseNames.includes(lowercaseDefault)) {
            into(ctx, print(lowercaseDefault + '\n'));
            resolve(lowercaseDefault);
          } else {
            reject(
              Error(`Prompt timeout expired without a valid default value`)
            );
          }
        }, opts.timeout);
      })
    ]);

    readline.close();
    if (timeout) clearTimeout(timeout);
    if (await isCancelled(ctx)) return;

    const index = lowercaseNames.indexOf(response);
    const name = names[index];

    if (!Object.hasOwnProperty.call(tasks, name)) {
      throw Error(`Task for "${name}" couldn't be retrieved`);
    }

    const task = tasks[name];
    return task ? run(task, ctx) : undefined;
  };
}
