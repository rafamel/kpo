import { Task } from '../definitions';
import { constants } from '../constants';
import { series } from '../tasks/aggregate/series';
import { stringifyKeyRoute } from './stringify-route';
import { Members, TypeGuard } from 'type-core';

interface Item {
  name: string;
  route: string[];
  task: Task;
}

interface ParseToArrayOptions {
  roots: boolean;
  defaults: boolean;
}

interface ParseToRecordOptions extends ParseToArrayOptions {
  include: string[] | null;
  exclude: string[] | null;
}

export function parseToRecord(
  options: ParseToRecordOptions,
  record: Task.Record
): Members<Task> {
  const { include, exclude } = options;
  const arr = parseToArray(
    { roots: options.roots, defaults: options.defaults },
    record
  );

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

export function parseToArray(
  options: ParseToArrayOptions,
  record: Task.Record
): Item[] {
  const names: string[] = [];

  return parseHelper(record, options.roots)
    .map(([route, task]) => {
      const name = stringifyKeyRoute(route);

      if (names.includes(name)) {
        throw Error(`Task name collusion on parse: ${name}`);
      }
      if (name.includes(' ')) {
        throw Error(`Task name must not contain spaces: ${name}`);
      }

      names.push(name);
      return { name, route, task };
    })
    .filter((item) => {
      return options.defaults
        ? Boolean(item.task)
        : Boolean(
            item.route.indexOf(constants.record.default) === -1 && item.task
          );
    });
}

function parseHelper(
  record: Task.Record,
  roots: boolean
): Array<[string[], Task]> {
  const arr: Array<[string[], Task]> = [];

  for (const [name, tasks] of Object.entries(record)) {
    if (TypeGuard.isFunction(tasks)) {
      arr.push([[name], tasks]);
    } else {
      const all: Task[] = [];
      const defaults: Task[] = [];
      const every: Array<[string[], Task]> = [];
      for (const [route, task] of parseHelper(tasks, roots)) {
        every.push([[name, ...route], task]);
        if (route.length <= 1) {
          route[0] === constants.record.default
            ? defaults.push(task)
            : all.push(task);
        }
      }

      if (roots) {
        if (defaults.length) {
          arr.push([[name], series(...defaults)]);
        } else if (all.length) {
          arr.push([[name], series(...all)]);
        }
      }

      if (every.length) arr.push(...every);
    }
  }

  return arr;
}
