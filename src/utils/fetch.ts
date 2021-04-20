import { TypeGuard } from 'type-core';
import { into } from 'pipettes';
import path from 'path';
import { Task } from '../definitions';
import { constants } from '../constants';
import { resolveProject } from '../helpers/resolve-project';

export interface FetchOptions {
  /** Tasks file name */
  file?: string;
  /** File directory */
  directory?: string;
  /** Change the process cwd before an import */
  chdir?: boolean;
}

/**
 * Fetch a tasks file with a `Task.Record` as a
 * default export.
 */
export async function fetch(options?: FetchOptions): Promise<Task.Record> {
  const opts = into(options || {}, (options) => ({
    file: options.file || constants.cli.file,
    directory: options.directory || null,
    chdir: options.chdir || false
  }));

  const project = await resolveProject({
    fail: true,
    file: opts.file,
    directory: opts.directory
  });

  if (opts.chdir) process.chdir(project.directory);
  const filepath = path.resolve(project.directory, project.file);
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
