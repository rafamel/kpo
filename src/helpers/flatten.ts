import { TypeGuard } from 'type-core';
import { into } from 'pipettes';

import type { Dictionary } from '../types';
import type { Task } from '../definitions';
import { context } from '../tasks/creation/context';

export function flatten(
  task?: null | Task | Array<null | Task> | Dictionary<null | Task>,
  ...tasks: Array<null | Task>
): Task[] {
  return into(
    null,
    () => {
      if (!task) return [];
      if (!TypeGuard.isObject(task)) return [task];
      return Object.entries(task || {}).map(([key, task]): Task | null => {
        return task
          ? context((ctx) => ({ ...ctx, route: ctx.route.concat(key) }), task)
          : null;
      });
    },
    (arr) => {
      return arr
        .concat(tasks)
        .filter((task): task is Task.Async => Boolean(task));
    }
  );
}
