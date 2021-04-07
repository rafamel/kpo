import { Task, Context } from '../../definitions';
import { isInteractive } from '../../utils/is-interactive';
import { run } from '../../utils/run';
import { raises } from '../exception/raises';
import { log } from './log';
import { Empty } from 'type-core';
import { into } from 'pipettes';

/**
 * Marks a task as interactive.
 * Will error on non-interactive environments
 * unless an `alternate` task is provided.
 * @returns Task
 */
export function interactive(task: Task, alternate: Task | Empty): Task.Async {
  return async (ctx: Context): Promise<void> => {
    const interactive = isInteractive(ctx);

    into(
      ctx,
      log(
        'debug',
        interactive ? 'Interactive' : 'Non-interactive',
        'environment detected'
      )
    );

    return run(
      interactive
        ? task
        : alternate || raises(Error('Non-interactive environment detected')),
      ctx
    );
  };
}
