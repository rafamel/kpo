import fs from 'fs';
import path from 'path';
import findUp from 'find-up';
import pify from 'pify';
import ensure from '~/utils/ensure';

export async function find(
  filename: string | string[],
  directory: string,
  strict?: boolean
): Promise<string | null> {
  if (!strict) return findUp(filename, { cwd: directory });

  await exists(directory);
  const stat = await ensure.rejection(() => pify(fs.stat)(directory));
  if (!stat.isDirectory()) throw Error(`${directory} is not a directory`);

  const filenames: string[] = Array.isArray(filename) ? filename : [filename];
  for (let name of filenames) {
    const file = path.join(directory, name);
    // prettier-ignore
    if (await exists(file).then(() => true).catch(() => false)) return file;
  }
  return null;
}

export async function exists(file: string): Promise<void> {
  await ensure.rejection(() => {
    return new Promise((resolve, reject) => {
      fs.access(file, fs.constants.F_OK, (err) => {
        return err ? reject(Error(`${file} doesn't exist`)) : resolve(file);
      });
    });
  });
}
