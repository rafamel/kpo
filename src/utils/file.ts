import path from 'path';
import fs from 'fs-extra';
import up from 'find-up';

export function absolute(opts: { path: string; cwd: string }): string {
  return path.isAbsolute(opts.path)
    ? opts.path
    : path.join(opts.cwd, opts.path);
}

export async function exists(
  file: string,
  options: { fail?: boolean } = {}
): Promise<boolean> {
  return fs.pathExists(file).then(async (exists) => {
    if (options.fail && !exists) {
      throw Error(`${file} doesn't exist`);
    }
    return exists;
  });
}

export async function find(
  filename: string | string[],
  directory: string,
  strict?: boolean
): Promise<string | null> {
  if (!strict) return up(filename, { cwd: directory });

  await exists(directory, { fail: true });
  const stat = await fs.stat(directory);
  if (!stat.isDirectory()) throw Error(`${directory} is not a directory`);

  const filenames: string[] = Array.isArray(filename) ? filename : [filename];
  for (let name of filenames) {
    const file = path.join(directory, name);
    // prettier-ignore
    if (await exists(file)) return file;
  }
  return null;
}
