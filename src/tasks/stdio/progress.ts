import { TypeGuard } from 'type-core';
import isUnicodeSupported from 'is-unicode-supported';
import ora from 'ora';
import { Task } from '../../definitions';
import { stringifyPrintRoute } from '../../helpers/stringify';
import { getLogLevelPrefix, isLogLevelActive } from '../../helpers/logging';
import { isInteractive } from '../../utils/is-interactive';
import { style } from '../../utils/style';
import { run } from '../../utils/run';
import { create } from '../creation/create';
import { announce } from './announce';
import { silence } from './silence';

export interface ProgressOptions {
  /** Use instead of the task route */
  message?: string;
}

/**
 * Shows a spinner upon task initialization,
 * and a success message on successful finalization.
 * Will suppress the context's stdio.
 * Non-interactive environments will fallback to `announce`.
 * Logging levels equal or above debug will fallback to
 * logging the start and successful finalization of a task,
 * while maintaining the context's stdout and stderr.
 * @returns Task
 */
export function progress(task: Task, options?: ProgressOptions): Task.Async {
  return create(async (ctx) => {
    const opts = options || {};
    const silent = silence(task);

    const message = TypeGuard.isString(opts.message)
      ? opts.message
      : style('task ', { bold: true }) + stringifyPrintRoute(ctx.route);

    if (!isInteractive(ctx) || isLogLevelActive('debug', ctx)) {
      return announce(silent, { message, info: true, success: true });
    }

    const spinner = ora({
      color: 'cyan',
      indent: 0,
      stream: ctx.stdio[1],
      isEnabled: true,
      discardStdin: false,
      hideCursor: true
    });

    spinner.start(isUnicodeSupported() ? ' ' + message : message);
    let wasCancelled = false;
    ctx.cancellation.finally(() => (wasCancelled = true) && spinner.stop());
    try {
      await run(silent, ctx);
    } catch (err) {
      spinner.stopAndPersist({
        text: message,
        symbol: getLogLevelPrefix('info')
      });
      throw err;
    }
    spinner.stopAndPersist({
      text: message,
      symbol: getLogLevelPrefix(wasCancelled ? 'info' : 'success')
    });
  });
}
