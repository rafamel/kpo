import { TypeGuard } from 'type-core';
import isUnicodeSupported from 'is-unicode-supported';
import { into } from 'pipettes';
import ora from 'ora';
import { Stdio, Task } from '../../definitions';
import { stringifyPrintRoute } from '../../helpers/stringify';
import { getLogLevelPrefix, isLogLevelActive } from '../../helpers/logging';
import { isInteractive } from '../../utils/is-interactive';
import { style } from '../../utils/style';
import { run } from '../../utils/run';
import { context } from '../creation/context';
import { create } from '../creation/create';
import { announce } from './announce';

export interface ProgressOptions {
  /** Use instead of the task route */
  message?: string;
}

/**
 * Shows a spinner upon task initialization,
 * and a success message on successful finalization.
 * Fallsback to `anounce` on non-interactive environments
 * and logging levels equal or above debug.
 * Otherwise, it suppresses the context's stdio.
 * @returns Task
 */
export function progress(task: Task, options?: ProgressOptions): Task.Async {
  return create(async (ctx) => {
    const opts = options || {};
    const isDebug = isLogLevelActive('debug', ctx);

    const contextual = into(
      isDebug ? [null, ctx.stdio[1], ctx.stdio[2]] : [null, null, null],
      (stdio: Stdio) => context({ stdio }, task)
    );

    const message = TypeGuard.isString(opts.message)
      ? opts.message
      : style('task ', { bold: true }) + stringifyPrintRoute(ctx.route);

    if (isDebug || !isInteractive(ctx)) {
      return announce(contextual, { name: message, info: true, success: true });
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
      await run(contextual, ctx);
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
