import { Task } from '../definitions';
import { find } from '../helpers/find';
import { constants } from '../constants';
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
  file?: string | Empty,
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
    file: file || constants.defaults.file,
    cwd: opts.dir,
    exact: Boolean(options && options.dir)
  });

  if (!filepath) {
    const filename = path.basename(file || constants.defaults.file);
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

  if (constants.collections.restrict.length) {
    const restricted = Object.keys(tasks).filter((name) =>
      constants.collections.restrict.includes(name[0])
    );
    if (restricted.length) {
      throw Error(
        'Task names must not start with: "' +
          constants.collections.restrict.join('", "') +
          '"'
      );
    }
  }

  return tasks;
}
