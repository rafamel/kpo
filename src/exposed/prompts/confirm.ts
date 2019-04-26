import { TScript } from '~/types';
import prompts from 'prompts';
import { status } from 'promist';

/**
 * Options taken by `confirm`.
 */
export interface IConfirmOptions {
  /**
   * Initial value to select. If `true`, "yes" will be selected; if `false`, "no" will be the default choice. Defaults to `true`.
   */
  initial?: boolean;
  /**
   * `TScript` to execute if the user confirms.
   */
  yes?: TScript;
  /**
   * `TScript` to execute if the user chooses not to confirm.
   */
  no?: TScript;
  /**
   * Period to wait for user input, in milliseconds. If defined, the selected choice -see `initial`- will continue execution.
   */
  timeout?: number;
}

export default confirm;

function confirm(message: string, options?: IConfirmOptions): TScript;
function confirm(options?: IConfirmOptions): TScript;
/**
 * Shows a confirmation prompt on `stdout` with a binary choice (yes or no); actions for each user choice can be passed via `options`.
 * @returns A `TScript`, as a function, that won't be executed until called by `kpo` -hence, calling `confirm` won't have any effect until the returned function is called.
 */
function confirm(...args: any[]): TScript {
  return async function confirm(): Promise<TScript> {
    const message: string =
      args[0] && typeof args[0] === 'string' ? args[0] : 'Continue?';
    const options: IConfirmOptions =
      args[1] || (args[0] && typeof args[0] !== 'string' ? args[0] : {});

    const promise = status(
      prompts({
        type: 'confirm',
        name: 'value',
        message:
          message +
          (options.timeout
            ? ` [${Math.round(options.timeout / 100) / 10}s]`
            : ''),
        initial: options.initial === undefined ? true : options.initial
      })
    );

    if (options.timeout) {
      setTimeout(() => {
        if (promise.status === 'pending') process.stdin.emit('data', '\n');
      }, options.timeout);
    }

    const response = await promise;
    return (response.value ? options.yes : options.no) || undefined;
  };
}
