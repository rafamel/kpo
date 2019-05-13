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
  type: 'file' | 'directory',
  cwd: string,
  strict?: boolean
): Promise<string | null> {
  if (!strict) {
    const file = await up(filename, { cwd, type });
    return file || null;
  }

  await exists(cwd, { fail: true });
  const stat = await fs.stat(cwd);
  if (!stat.isDirectory()) throw Error(`${cwd} is not a directory`);

  const filenames: string[] = Array.isArray(filename) ? filename : [filename];
  for (let name of filenames) {
    const file = path.join(cwd, name);
    // prettier-ignore
    if (await exists(file)) {
      const stat = await fs.stat(file);
      if (type === 'file' && !stat.isDirectory()) return file;
      else if (type === 'directory' && stat.isDirectory()) return file;
    }
  }
  return null;
}
