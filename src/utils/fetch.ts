import { Task } from '../definitions';
import { find } from '../helpers/find';
import { TypeGuard } from 'type-core';
import path from 'path';

export interface FetchOptions {
  file?: string;
  cwd?: string;
}

export async function fetch(options?: FetchOptions): Promise<Task.Record> {
  const opts = Object.assign(
    { file: 'kpo.tasks.js', cwd: process.cwd() },
    options
  );

  const filepath = await find({
    file: opts.file,
    cwd: opts.cwd,
    exact: Boolean(options && options.file)
  });

  if (!filepath) {
    const filename = path.basename(opts.file);
    throw Error(`File not found in path: ${filename}`);
  }

  const file = await import(filepath);
  if (
    !Object.hasOwnProperty.call(file, 'default') ||
    !TypeGuard.isRecord(file.default)
  ) {
    throw Error(`Default tasks export not found: ${filepath}`);
  }

  const tasks = file.default;

  const empty = Object.keys(tasks).filter((name) => !name);
  if (empty.length) {
    throw Error(`Task record must not have empty string keys`);
  }

  const restricted = Object.keys(tasks)
    .filter((name) => name[0] === ':')
    .map((name) => `"${name}"`);
  if (restricted.length) {
    throw Error(
      `Root task keys must not start with ":": ${restricted.join(', ')}`
    );
  }

  return tasks;
}
