import path from 'path';
import fs from 'fs-extra';
import logger from '~/utils/logger';
import ensure from '../../tags/ensure';
import { rejects } from 'errorish';

export default async function write(
  file: string,
  relative: string,
  content: string
): Promise<void> {
  await ensure.fn(path.parse(file).dir);
  await fs.writeFile(file, String(content)).catch(rejects);
  logger.info(`Written: ${relative}`);
}
