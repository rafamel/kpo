import { TScript, IOfType } from '~/types';
import prompts from 'prompts';

export interface ISelectOptions {
  message?: string;
  initial?: string;
  values: IOfType<TScript>;
}

export default function select(options: ISelectOptions): TScript {
  return async function select(): Promise<TScript> {
    const keys = Object.keys(options.values || {});
    if (!keys.length) throw Error(`No values passed to select`);

    const response = await prompts({
      type: 'select',
      name: 'value',
      message: options.message || 'Choose an option',
      choices: keys.map((key) => ({
        title: key,
        value: key
      })),
      initial: options.initial ? Math.max(0, keys.indexOf(options.initial)) : 0
    });

    return options.values[response.value] || undefined;
  };
}
