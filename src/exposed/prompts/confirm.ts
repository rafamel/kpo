import { TScript } from '~/types';
import prompts from 'prompts';
import { status } from 'promist';

export interface IConfirmOptions {
  message?: string;
  initial?: boolean;
  yes?: TScript;
  no?: TScript;
  timeout?: number;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function confirm(options: IConfirmOptions = {}) {
  return async function confirm(): Promise<TScript> {
    const promise = status(
      prompts({
        type: 'confirm',
        name: 'value',
        message:
          (options.message || 'Continue?') +
          (options.timeout
            ? ` [${Math.round(options.timeout / 100) / 10}s]`
            : ''),
        initial: options.initial || false
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
