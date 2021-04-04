import { Task } from '../definitions';
import { context } from '../tasks/creation/context';
import { Members, Empty, TypeGuard } from 'type-core';
import { into } from 'pipettes';

export function flatten(
  task?: Task | Empty | Array<Task | Empty> | Members<Task | Empty>,
  ...tasks: Array<Task | Empty>
): Task[] {
  return into(
    null,
    () => {
      if (!task) return [];
      if (!TypeGuard.isObject(task)) return [task];
      return Object.entries(task || {}).map(([key, task]): Task | Empty => {
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
