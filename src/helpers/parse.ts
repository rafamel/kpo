import { Task } from '../definitions';
import { series } from '../tasks/aggregate/series';
import { stringifyRoute } from './stringify-route';
import { Members } from 'type-core';

interface Item {
  name: string;
  route: string[];
  task: Task;
}

interface Options {
  include: string[] | null;
  exclude: string[] | null;
}

export function parseToRecord(
  options: Options,
  record: Task.Record
): Members<Task> {
  const { include, exclude } = options;
  const arr = parseToArray(record);

  const members: Members<Task> = {};
  for (const item of arr) {
    if (exclude && exclude.includes(item.name)) continue;
    if (include && !include.includes(item.name)) continue;
    members[item.name] = item.task;
  }

  if (include) {
    for (const name of include) {
      if (!Object.hasOwnProperty.call(members, name)) {
        throw Error(`Task not found: ${name}`);
      }
    }
  }

  return members;
}

export function parseToArray(record: Task.Record): Item[] {
  const names: string[] = [];

  return parseHelper(record)
    .map(([route, task]) => {
      const name = stringifyRoute(route);

      if (names.includes(name)) {
        throw Error(`Task name collusion on parse: ${name}`);
      }
      if (name.includes(' ')) {
        throw Error(`Task name must not contain spaces: ${name}`);
      }

      names.push(name);
      return { name, route, task };
    })
    .filter((item): item is Item => Boolean(item.task));
}

function parseHelper(record: Task.Record): Array<[string[], Task]> {
  const arr: Array<[string[], Task]> = [];

  for (const [name, tasks] of Object.entries(record)) {
    if (typeof tasks === 'function') {
      arr.push([[name], tasks]);
    } else {
      const all: Task[] = [];
      const every: Array<[string[], Task]> = [];
      for (const [route, task] of parseHelper(tasks)) {
        every.push([[name, ...route], task]);
        if (route.length <= 1) all.push(task);
      }

      if (all.length) arr.push([[name], series(...all)]);
      if (every.length) arr.push(...every);
    }
  }

  return arr;
}
