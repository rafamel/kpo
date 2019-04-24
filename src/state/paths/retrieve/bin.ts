import path from 'path';
import up from 'find-up';

export default async function getBin(dir: string): Promise<string[]> {
  const bin = await up('node_modules/.bin', { cwd: dir });
  return bin ? [bin].concat(await getBin(path.join(dir, '../'))) : [];
}
