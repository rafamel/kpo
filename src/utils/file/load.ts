import path from 'path';
import fs from 'fs-extra';
import { rejects } from 'errorish';
import { IOfType } from '~/types';
import { open } from '../errors';
import yaml from 'js-yaml';

export default async function load(file: string): Promise<IOfType<any>> {
  const { ext } = path.parse(file);

  switch (ext) {
    case '.js':
      return open.throws(() => require(file));
    case '.json':
      return fs.readJSON(file).catch(rejects);
    case '.yml':
    case '.yaml':
      return yaml.safeLoad(
        await fs
          .readFile(file)
          .then(String)
          .catch(rejects)
      );
    default:
      throw Error(`Extension not valid`);
  }
}
