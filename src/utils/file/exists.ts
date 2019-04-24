import fs from 'fs-extra';
import { rejects } from 'errorish';

export default async function exists(
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
