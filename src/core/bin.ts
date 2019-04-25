import path from 'path';
import up from 'find-up';

export default async function getBin(
  ...directories: string[]
): Promise<string[]> {
  const all = await Promise.all(directories.map(each));

  const a: string[] = [];
  let b: string[] = [];
  for (let bins of all) {
    if (bins.length) {
      a.push(bins.shift() as string);
      b = b.concat(bins);
    }
  }

  return a.concat(b).filter((x, i, arr) => x && arr.indexOf(x) === i);
}

export async function each(directory: string): Promise<string[]> {
  const bin = await up('node_modules/.bin', { cwd: directory });
  return bin ? [bin].concat(await each(path.join(directory, '../'))) : [];
}
