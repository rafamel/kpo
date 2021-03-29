import { Task } from '../definitions';
import { find } from '../helpers/find';
import { Empty, TypeGuard } from 'type-core';
import path from 'path';

export interface FetchOptions {
  /** File directory */
  dir?: string;
}

/**
 * Fetches a tasks file with a `Task.Record` as a
 * default export.
 */
export async function fetch(
  file: string,
  options?: FetchOptions | Empty,
  cb?: (path: string) => void
): Promise<Task.Record> {
  const opts = {
    dir:
      options && options.dir
        ? path.resolve(process.cwd(), options.dir)
        : process.cwd()
  };

  const filepath = await find({
    file: file,
    cwd: opts.dir,
    exact: Boolean(options && options.dir)
  });

  if (!filepath) {
    const filename = path.basename(file);
    throw Error(`File not found in path: ${filename}`);
  }

  if (cb) cb(filepath);
  const data = await import(filepath);
  if (
    !Object.hasOwnProperty.call(data, 'default') ||
    !TypeGuard.isRecord(data.default)
  ) {
    throw Error(`Default tasks export not found: ${filepath}`);
  }

  const tasks = data.default;

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
