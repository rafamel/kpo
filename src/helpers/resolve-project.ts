import path from 'node:path';
import { find } from './find';

export interface ResolveProjectOptions {
  files: string[];
  directory: string | null;
}

export interface Project {
  file: string;
  directory: string;
}

export async function resolveProject<A extends boolean>(
  assert: A,
  options: ResolveProjectOptions
): Promise<A extends true ? Project : Project | null> {
  if (!options.files.length) {
    if (assert) throw Error(`No project file names specified`);
    return null as A extends true ? Project : Project | null;
  }

  const cwd = process.cwd();
  const directory = options.directory
    ? path.resolve(cwd, options.directory)
    : null;

  const filepath = await find({
    files: options.files,
    cwd: directory || cwd,
    exact: Boolean(directory)
  });

  if (!filepath) {
    if (assert) throw Error(`File not found in path: ${options.files}`);
    return null as A extends true ? Project : Project | null;
  }

  if (directory) {
    return {
      file: path.resolve(directory, filepath),
      directory
    };
  }
  return {
    file: path.basename(filepath),
    directory: path.dirname(filepath)
  };
}
