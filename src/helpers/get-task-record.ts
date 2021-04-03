import { Task } from '../definitions';
import { fetch } from '../utils/fetch';
import { Empty, TypeGuard } from 'type-core';

export async function getTaskRecord(
  tasks: string | Task.Record | Empty
): Promise<Task.Record> {
  if (TypeGuard.isRecord(tasks)) {
    return tasks;
  }
  if (TypeGuard.isString(tasks) || TypeGuard.isEmpty(tasks)) {
    return fetch(tasks);
  }
  throw Error(`A valid task record or path to a tasks file must be provided`);
}
