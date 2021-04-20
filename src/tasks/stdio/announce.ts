import { Empty, TypeGuard } from 'type-core';
import { shallow } from 'merge-strategies';
import { Task } from '../../definitions';
import { stringifyPrintRoute } from '../../helpers/stringify';
import { style } from '../../utils/style';
import { series } from '../aggregate/series';
import { create } from '../creation/create';
import { log } from '../stdio/log';

export interface AnnounceOptions {
  /** Print route before execution */
  info?: boolean;
  /** Print route after successful execution */
  success?: boolean;
  /** Use instead of the task route */
  message?: string;
}

/**
 * Prints tasks route before execution and upon success.
 * @returns Task
 */
export function announce(
  options: AnnounceOptions | Empty,
  task: Task
): Task.Async {
  return create((ctx) => {
    const opts = shallow({ info: true, success: false }, options || undefined);

    const message = TypeGuard.isString(opts.message)
      ? opts.message
      : style('task ', { bold: true }) + stringifyPrintRoute(ctx.route);

    return series(
      opts.info ? log('info', message) : null,
      task,
      opts.success ? log('success', message) : null
    );
  });
}
