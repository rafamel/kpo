import { TScript, IOfType } from '~/types';
import prompts from 'prompts';
import { wrap } from '~/utils/errors';

/**
 * Options taken by `select`.
 */
export interface ISelectOptions {
  /**
   * Initial option to select. If defined, it must be a key of `values`.
   */
  initial?: string;
  /**
   * Possible values to select, represented as object keys, with the action that each of them will triggered, represented as `TScript` object values.
   */
  values: IOfType<TScript>;
}

export default select;

function select(message: string, options?: ISelectOptions): TScript;
function select(options?: ISelectOptions): TScript;
/**
 * Shows a selection prompt on `stdout` with a choice of a number of values, set via `options`, each triggering a `TScript` execution.
 * @returns A `TScript`, as a function, that won't be executed until called by `kpo` -hence, calling `select` won't have any effect until the returned function is called.
 */
function select(...args: any[]): TScript {
  return (): Promise<TScript> => {
    return wrap.throws(async () => {
      const message: string =
        args[0] && typeof args[0] === 'string' ? args[0] : 'Choose an option';
      const options: ISelectOptions =
        args[1] || (args[0] && typeof args[0] !== 'string' ? args[0] : {});

      const keys = Object.keys(options.values || {});
      if (!keys.length) throw Error(`No values passed to select`);

      const response = await prompts({
        type: 'select',
        name: 'value',
        message: message,
        choices: keys.map((key) => ({
          title: key,
          value: key
        })),
        initial: options.initial
          ? Math.max(0, keys.indexOf(options.initial))
          : 0
      });

      return options.values[response.value] || undefined;
    });
  };
}
