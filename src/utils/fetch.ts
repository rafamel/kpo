import { Task } from '../definitions';
import { find } from '../helpers/find';
import { TypeGuard, Members } from 'type-core';
import path from 'path';

export interface FetchOptions {
  file?: string;
  dir?: string;
}

export async function fetch(
  options?: FetchOptions,
  cb?: (path: string) => void
): Promise<Members<Task>> {
  const opts = {
    file: (options && options.file) || 'kpo.tasks.js',
    dir:
      options && options.dir
        ? path.resolve(process.cwd(), options.dir)
        : process.cwd()
  };

  const filepath = await find({
    file: opts.file,
    cwd: opts.dir,
    exact: options ? Boolean(options.file || options.dir) : false
  });

  if (!filepath) {
    const filename = path.basename(opts.file);
    throw Error(`File not found in path: ${filename}`);
  }

  if (cb) cb(filepath);
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
