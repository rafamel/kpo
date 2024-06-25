import { type Empty, TypeGuard } from 'type-core';
import isUnicodeSupported from 'is-unicode-supported';
import ora from 'ora';

import type { Task } from '../../definitions';
import { addPrefix } from '../../helpers/prefix';
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
export function progress(
  options: ProgressOptions | Empty,
  task: Task
): Task.Async {
  return create(async (ctx) => {
    const opts = options || {};
    const silent = silence(task);

    const message = TypeGuard.isString(opts.message)
      ? opts.message
      : style('task ', { bold: true }) + stringifyPrintRoute(ctx.route);

    if (!isInteractive(ctx) || isLogLevelActive('debug', ctx)) {
      return announce({ message, info: true, success: true }, silent);
    }

    const spinner = ora({
      color: undefined,
      indent: 0,
      stream: ctx.stdio[1],
      isEnabled: true,
      discardStdin: false,
      hideCursor: true,
      spinner: {
        frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].map(
          (str) => {
            return addPrefix(style(str, { color: 'cyan' }), null, 'print', ctx);
          }
        )
      }
    });

    spinner.start(isUnicodeSupported() ? ' ' + message : message);
    let wasCancelled = false;
    ctx.cancellation.finally(() => (wasCancelled = true) && spinner.stop());
    try {
      await run(ctx, silent);
    } catch (err) {
      spinner.stopAndPersist({
        text: message,
        symbol: addPrefix(getLogLevelPrefix('info'), null, 'print', ctx)
      });
      throw err;
    }
    spinner.stopAndPersist({
      text: message,
      symbol: addPrefix(
        getLogLevelPrefix(wasCancelled ? 'info' : 'success'),
        null,
        'print',
        ctx
      )
    });
  });
}
