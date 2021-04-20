import { Empty } from 'type-core';
import { Task } from '../../definitions';
import { isInteractive } from '../../utils/is-interactive';
import { series } from '../aggregate/series';
import { raises } from '../exception/raises';
import { create } from '../creation/create';
import { log } from './log';

/**
 * Marks a task as interactive.
 * Will error on non-interactive environments
 * unless an `alternate` task is provided.
 * @returns Task
 */
export function interactive(task: Task, alternate: Task | Empty): Task.Async {
  return create(async (ctx) => {
    const interactive = isInteractive(ctx);
    return series(
      log(
        'debug',
        interactive ? 'Interactive' : 'Non-interactive',
        'environment'
      ),
      interactive
        ? task
        : alternate || raises(Error('Non-interactive environment detected'))
    );
  });
}
