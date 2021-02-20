import { Task } from '../definitions';
import { Empty } from 'type-core';

/**
 * Maps all tasks in a `Task.Record`.
 */
export function recreate(
  map: (task: Task, route: string[]) => Task | Empty,
  tasks: Task.Record
): Task.Record {
  return recreateHelper([], tasks, map);
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
