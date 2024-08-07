import { ensure } from 'errorish';

import type { Dictionary } from '../../types';
import type { Task } from '../../definitions';
import { run } from '../../utils/run';
import { flatten } from '../../helpers/flatten';
import { series } from '../aggregate/series';
import { create } from '../creation/create';
import { log } from '../stdio/log';
import { raises } from './raises';

/**
 * Executes all tasks in series.
 * If any of the tasks throws an exception,
 * it will throw after all tasks have
 * finalized with the latest thrown exception.
 * @returns Task
 */
export function finalize(
  task?: null | Task | Array<null | Task> | Dictionary<null | Task>,
  ...tasks: Array<null | Task>
): Task.Async {
  const items = flatten(task, ...tasks);

  return create(() => {
    const errors: Error[] = [];

    return series(
      ...items.map((item) => {
        return item
          ? create(async (ctx) => {
              try {
                await run(ctx, item);
              } catch (err) {
                errors.push(ensure(err));
              }
            })
          : null;
      }),
      create(() => {
        if (!errors.length) return;

        const err = errors.pop() as Error;
        return series(
          ...errors.map((error) => log('trace', error)),
          raises(err)
        );
      })
    );
  });
}
