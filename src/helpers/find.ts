import path from 'path';
import up from 'find-up';
import fs from 'fs-extra';

export interface FindOptions {
  file: string;
  cwd: string;
  exact: boolean;
}

export async function find(options: FindOptions): Promise<string | null> {
  const filepath = path.resolve(options.cwd, options.file);

  if (!options.exact) {
    const file = await up(path.basename(filepath), {
      cwd: path.dirname(filepath),
      type: 'file'
    });
    return file || null;
  }

  const exists = await fs.pathExists(filepath);
  if (!exists) return null;

  const isDirectory = await fs
    .stat(options.cwd)
    .then((stat) => stat.isDirectory());
  if (isDirectory) return null;

  return filepath;
}
