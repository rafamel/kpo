import path from 'path';
import fs from 'fs-extra';
import glob from 'glob';
import { parallel } from 'promist';
import { exists } from '~/utils/file';
import { FILE_NAME, FILE_EXT } from '~/constants';
import { IChild } from '../../types';

export default async function getChildrenFromGlobs(
  patterns: string[],
  directory: string
): Promise<IChild[]> {
  const arrs = await parallel.map(patterns, (pattern) =>
    fromGlob(pattern, directory)
  );

  const dirs = arrs.reduce((acc: string[], arr: string[]) => {
    return acc.concat(arr);
  }, []);

  // filter and make into IChild
  const children = filter(dirs).map((dir) => ({
    name: path.parse(dir).name,
    // absolute path
    directory: path.join(directory, dir)
  }));

  // Check for name conflicts
  const conflicts = children
    .map((child) => child.name)
    .filter((name, i, arr) => arr.indexOf(name) !== i);
  if (conflicts.length)
    throw Error(
      `There are several children scopes with the same name: ` +
        conflicts.join(', ')
    );

  return children;
}

export async function fromGlob(
  pattern: string,
  directory: string
): Promise<string[]> {
  return parallel.filter(
    await new Promise((resolve: (arg: string[]) => void, reject) =>
      glob(pattern, { cwd: directory }, (err, matches) =>
        err ? reject(err) : resolve(matches)
      )
    ),
    async (dir: string) => {
      // get absolute path
      dir = path.join(directory, dir);

      // select only directories
      const stat = await fs.stat(dir);
      if (!stat.isDirectory()) return false;

      // select only directories that have a package.json
      // or a kpo configuration file
      const toFind = ['package.json']
        .concat(FILE_EXT.map((ext) => FILE_NAME + ext))
        .map((file) => path.join(dir, file));

      for (const file of toFind) {
        if (await exists(file)) return true;
      }

      return false;
    }
  );
}

/**
 * Filter directories: select only the first one in depth
 * in which a configuration file was found.
 * If we have /foo and /foo/bar, only /foo will be selected
 */
export function filter(dirs: string[]): string[] {
  dirs = dirs.sort();
  let i = 1;
  while (i < dirs.length) {
    const current = dirs[i];
    const previous = dirs[i - 1];
    if (current.slice(0, previous.length) === previous) {
      dirs = dirs.slice(0, i).concat(dirs.slice(i + 1));
    } else {
      i++;
    }
  }

  return dirs;
}
