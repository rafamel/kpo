import path from 'path';
import fs from 'fs-extra';
import up from 'find-up';
import { rejects } from 'errorish';
import exists from './exists';

export default async function find(
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
