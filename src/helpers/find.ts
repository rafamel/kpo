import path from 'node:path';
import up from 'find-up';
import fs from 'fs-extra';

export interface FindOptions {
  cwd: string;
  files: string[];
  exact: boolean;
}

export async function find(options: FindOptions): Promise<string | null> {
  if (!options.exact) {
    const file = await up(options.files, {
      cwd: options.cwd,
      type: 'file'
    });
    return file || null;
  }

  for (const file of options.files) {
    const filepath = path.resolve(options.cwd, file);
    const exists = await fs.pathExists(filepath);
    if (exists) {
      const isDirectory = await fs
        .stat(filepath)
        .then((stat) => stat.isDirectory());
      if (!isDirectory) return filepath;
    }
  }

  return null;
}
