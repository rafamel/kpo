import fs from 'fs-extra';
import path from 'path';
import up from 'find-up';
import { rejects } from 'errorish';

export async function find(
  filename: string | string[],
  directory: string,
  strict?: boolean
): Promise<string | null> {
  if (!strict) return up(filename, { cwd: directory });

  await exists(directory, { fail: true });
  const stat = await fs.stat(directory).catch(rejects);
  if (!stat.isDirectory()) throw Error(`${directory} is not a directory`);

  const filenames: string[] = Array.isArray(filename) ? filename : [filename];
  for (let name of filenames) {
    const file = path.join(directory, name);
    // prettier-ignore
    if (await exists(file)) return file;
  }
  return null;
}

export async function exists(
  file: string,
  options: { fail?: boolean } = {}
): Promise<boolean> {
  return fs
    .pathExists(file)
    .catch(rejects)
    .then((exists) => {
      return rejects(`${file} doesn't exist`, {
        case: options.fail && !exists
      }).then(() => exists);
    });
}
