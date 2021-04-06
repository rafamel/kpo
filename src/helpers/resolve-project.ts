import path from 'path';
import { find } from './find';

export interface ResolveProjectOptions {
  fail: boolean;
  file: string;
  directory: string | null;
}

export interface Project {
  file: string;
  directory: string;
}

export async function resolveProject(
  options: ResolveProjectOptions
): Promise<Project> {
  const cwd = process.cwd();
  const directory = options.directory
    ? path.resolve(cwd, options.directory)
    : null;

  const filepath = await find({
    file: options.file,
    cwd: directory || cwd,
    exact: Boolean(directory)
  });

  if (!filepath) {
    if (options.fail) {
      throw Error(`File not found in path: ${options.file}`);
    }
    return {
      file: options.file,
      directory: directory || cwd
    };
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
