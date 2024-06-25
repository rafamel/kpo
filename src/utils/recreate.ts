import { type Empty, type NullaryFn, TypeGuard } from 'type-core';
import { shallow } from 'merge-strategies';
import { into } from 'pipettes';

import type { Task } from '../definitions';
import { context } from '../tasks/creation/context';
import { announce } from '../tasks/stdio/announce';

export interface RecreateOptions {
  /**
   * Fixes current routes for tasks according to their
   * current paths, so they won't be dinamically reassigned.
   */
  fix?: boolean;
  /**
   * Prints routes before execution for all tasks.
   */
  announce?: boolean;
}

export interface RecreateMap {
  (task: Task, route: string[]): Task | Empty;
}

/**
 * Maps all tasks in a `Task.Record`.
 */
export function recreate(
  options: RecreateOptions | RecreateMap | Empty,
  tasks: Task.Record | NullaryFn<Task.Record>
): Task.Record {
  const record = TypeGuard.isFunction(tasks) ? tasks() : tasks;

  if (TypeGuard.isEmpty(options)) {
    return record;
  } else if (TypeGuard.isFunction(options)) {
    return recreateHelper([], record, options);
  } else {
    const opts: RecreateOptions = shallow(
      { fix: false, announce: false },
      options || undefined
    );
    return recreateHelper([], record, (task, route) => {
      return into(
        task,
        (task) => (opts.announce ? announce(null, task) : task),
        (task) => (opts.fix ? context({ route }, task) : task)
      );
    });
  }
}

function recreateHelper(
  route: string[],
  tasks: Task.Record,
  map: (task: Task, route: string[]) => Task | Empty
): Task.Record {
  return Object.entries(tasks).reduce((acc, [key, value]) => {
    if (typeof value === 'function') {
      const task = map(value, route.concat(key));
      return task ? { ...acc, [key]: task } : acc;
    } else {
      const record = recreateHelper(route.concat(key), value, map);
      return Object.keys(record).length ? { ...acc, [key]: record } : acc;
    }
  }, {} as Task.Record);
}
