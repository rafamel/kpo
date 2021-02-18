import { Task } from '../../definitions';
import { parseRecord } from '../../helpers/parse-record';
import { Members } from 'type-core';

export function parse(
  tasks: Task.Record,
  cb?: (route: string[]) => string
): Members<Task> {
  const arr = parseRecord(tasks, cb);

  const members: Members<Task> = {};
  for (const item of arr) {
    members[item.name] = item.task;
  }

  return members;
}
