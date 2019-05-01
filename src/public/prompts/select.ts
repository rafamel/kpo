import { TScript, IOfType } from '~/types';
import prompts from 'prompts/dist';
import expose, { TExposedOverload } from '~/utils/expose';

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

export default expose(select) as TExposedOverload<
  typeof select,
  [string, ISelectOptions] | [ISelectOptions]
>;

function select(
  message: string,
  options: ISelectOptions
): () => Promise<TScript>;
function select(options: ISelectOptions): () => Promise<TScript>;
/**
 * Shows a selection prompt on `stdout` with a choice of a number of values, set via `options`, each triggering a `TScript` execution.
 * It is an *exposed* function: call `select.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function -hence, calling `select` won't have any effect until the returned function is called.
 */
function select(...args: any[]): () => Promise<TScript> {
  return async () => {
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
      initial: options.initial ? Math.max(0, keys.indexOf(options.initial)) : 0
    });

    return options.values[response.value];
  };
}
