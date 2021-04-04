import { formatMessage } from '../helpers/format-message';
import { run } from '../utils/run';
import { log } from '../tasks/stdio/log';
import { constants } from '../constants';
import main from './main';
import { NullaryFn } from 'type-core';
import { shallow } from 'merge-strategies';
import { attach, options as _options, resolver, add } from 'exits';

export interface BinOptions {
  /** Name of kpo's executable. */
  bin?: string;
  /** Default tasks file name */
  file?: string;
  /** Executable description */
  description?: string;
  /** Executable version */
  version?: string;
}

/**
 * Bin runs `kpo` as if it was being run as a CLI command.
 */
export async function bin(options?: BinOptions): Promise<void> {
  try {
    const opts = shallow(
      {
        bin: constants.bin,
        file: constants.file,
        description: constants.description,
        version: constants.version
      },
      options || undefined
    );

    const task = await main({ argv: process.argv.slice(2) }, opts);

    const cbs: NullaryFn[] = [];
    const cancellation = new Promise<void>((resolve) => cbs.push(resolve));
    const promise = run(task, { cancellation });

    attach();
    _options({
      spawned: { signals: 'none', wait: 'none' },
      resolver(type, arg) {
        return type === 'signal' ? resolver('exit', 1) : resolver(type, arg);
      }
    });
    add(async () => {
      cbs.map((cb) => cb());
      await Promise.all([cancellation, promise]).catch(() => undefined);
    });

    await promise;
  } catch (err) {
    await run(log('error', formatMessage(err)));
    return process.exit(1);
  }
}