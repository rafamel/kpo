import { Task } from '../../definitions';
import { stringifyPrintRoute } from '../../helpers/stringify';
import { style } from '../../utils/style';
import { series } from '../aggregate/series';
import { create } from '../creation/create';
import { log } from '../stdio/log';
import { shallow } from 'merge-strategies';

export interface AnnounceOptions {
  info: boolean;
  success: boolean;
}

/**
 * Prints tasks route before execution and upon success.
 * @returns Task
 */
export function announce(task: Task, options?: AnnounceOptions): Task.Async {
  return create((ctx) => {
    const opts = shallow({ info: true, success: true }, options || undefined);

    return series(
      opts.info
        ? log(
            'info',
            style('task', { bold: true }),
            stringifyPrintRoute(ctx.route)
          )
        : null,
      task,
      opts.success
        ? log(
            'success',
            style('task', { bold: true }),
            stringifyPrintRoute(ctx.route)
          )
        : null
    );
  });
}
