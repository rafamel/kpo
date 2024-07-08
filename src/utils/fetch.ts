import path from 'node:path';
import process from 'node:process';

import { TypeGuard } from 'type-core';
import { into } from 'pipettes';

import type { Task } from '../definitions';
import { constants } from '../constants';
import { resolveProject } from '../helpers/resolve-project';

export interface FetchOptions {
  /** Tasks file names */
  files?: string[];
  /** File directory */
  directory?: string;
  /** Default export object property for tasks */
  property?: string | number | null;
  /** Change the process cwd before an import */
  chdir?: boolean;
}

/**
 * Fetch a tasks file that's expected to have
 * a `Task.Record` as a default export.
 */
export async function fetch(
  options?: FetchOptions | null
): Promise<Task.Record> {
  const opts = into(options || {}, (options) => ({
    files: options.files || constants.cli.files,
    directory: options.directory || null,
    property: options.property || null,
    chdir: options.chdir || false
  }));

  const project = await resolveProject(true, {
    files: opts.files,
    directory: opts.directory
  });

  if (opts.chdir) process.chdir(project.directory);
  const filepath = path.resolve(project.directory, project.file);
  const content = await import(filepath);

  if (!TypeGuard.isObject(content) || !content.default) {
    throw new Error(`Default tasks export not found: ${filepath}`);
  }
  if (
    opts.property &&
    (!TypeGuard.isObject(content.default) || !content.default[opts.property])
  ) {
    throw new Error(
      `Property ${opts.property} not found on default export: ${filepath}`
    );
  }

  const item =
    opts.property === null ? content.default : content.default[opts.property];
  if (!TypeGuard.isRecord(item) && !TypeGuard.isFunction(item)) {
    throw new Error(`Exported tasks must be a record or function: ${filepath}`);
  }

  const tasks = TypeGuard.isFunction(item)
    ? item(await import(constants.name))
    : item;

  const empty = Object.keys(tasks).filter((name) => !name);
  if (empty.length) {
    throw new Error(`Task record must not have empty string keys`);
  }

  if (constants.collections.restrict.length) {
    const restricted = Object.keys(tasks).filter((name) =>
      constants.collections.restrict.includes(name[0])
    );
    if (restricted.length) {
      throw new Error(
        'Task names must not start with: "' +
          constants.collections.restrict.join('", "') +
          '"'
      );
    }
  }

  return tasks;
}
