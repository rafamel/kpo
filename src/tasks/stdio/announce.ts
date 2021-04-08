import { Task } from '../../definitions';
import { stringifyPrintRoute } from '../../helpers/stringify';
import { style } from '../../utils/style';
import { series } from '../aggregate/series';
import { create } from '../creation/create';
import { log } from '../stdio/log';
import { shallow } from 'merge-strategies';
import { TypeGuard } from 'type-core';

export interface AnnounceOptions {
  /** Use instead of the task route */
  name?: string;
  /** Print route before execution */
  info?: boolean;
  /** Print route after successful execution */
  success?: boolean;
}

/**
 * Prints tasks route before execution and upon success.
 * @returns Task
 */
export function announce(task: Task, options?: AnnounceOptions): Task.Async {
  return create((ctx) => {
    const opts = shallow({ info: true, success: true }, options || undefined);
    const name = TypeGuard.isString(opts.name)
      ? opts.name
      : stringifyPrintRoute(ctx.route);

    return series(
      opts.info ? log('info', style('task', { bold: true }), name) : null,
      task,
      opts.success ? log('success', style('task', { bold: true }), name) : null
    );
  });
}
