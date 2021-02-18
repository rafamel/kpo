import { Task } from '../definitions';
import { series } from '../tasks/aggregate/series';
import { context } from '../tasks/transform/context';
import ObjectPath from 'objectpath';

export interface TaskItem {
  name: string;
  route: string[];
  task: Task;
}

/**
 * Returns an ordered array
 */
export function parseRecord(
  record: Task.Record,
  cb?: (route: string[]) => string
): TaskItem[] {
  const names: string[] = [];

  return parseRecordHelper(record).map(([route, task]) => {
    const name = cb ? cb(route) : ObjectPath.stringify(route, "'", false);

    if (names.includes(name)) {
      throw Error(`Name collusion on parse: ${name}`);
    }

    names.push(name);
    return { name, route, task };
  });
}

function parseRecordHelper(record: Task.Record): Array<[string[], Task]> {
  const arr: Array<[string[], Task]> = [];

  for (const [name, task] of Object.entries(record)) {
    if (typeof task === 'function') {
      arr.push([
        [name],
        context(
          (ctx) => ({
            ...ctx,
            route: ctx.route.slice(0, -1).concat(name)
          }),
          task
        )
      ]);
    } else {
      const all: Task[] = [];
      const every: Array<[string[], Task]> = [];
      for (const [route, bTask] of parseRecordHelper(task)) {
        every.push([[name, ...route], bTask]);

        if (route.length <= 1) {
          const bName = route.slice(-1)[0];
          all.push(
            context(
              (ctx) => ({
                ...ctx,
                route: ctx.route.slice(0, -1).concat(bName)
              }),
              bTask
            )
          );
        }
      }

      if (all.length) {
        arr.push([
          [name],
          context(
            (ctx) => ({ ...ctx, route: ctx.route.slice(0, -1).concat(name) }),
            series(...all)
          )
        ]);
      }
      if (every.length) {
        arr.push(...every);
      }
    }
  }

  return arr;
}
