import { Task, Context } from '../../definitions';
import { useDestination } from '../../helpers/paths';
import { log } from '../stdio/log';
import { Serial } from 'type-core';
import { shallow } from 'merge-strategies';
import { into } from 'pipettes';
import fs from 'fs-extra';

export interface WriteOptions {
  /** Whether to error, ignore, or overwrite existing files */
  exists?: 'error' | 'ignore' | 'overwrite';
}

/**
 * Writes a file with a `content` at `path`.
 * @returns Task
 */
export function write(
  path: string,
  content: Buffer | Serial.Type,
  options?: WriteOptions
): Task.Async {
  return async (ctx: Context): Promise<void> => {
    into(ctx, log('debug', 'Write:', path));

    const data = Buffer.isBuffer(content)
      ? content
      : typeof content === 'object'
      ? JSON.stringify(content, null, 2)
      : String(content);

    await useDestination(
      path,
      ctx,
      shallow({ exists: 'error' }, options || undefined),
      (dest) => fs.writeFile(dest, data)
    );
  };
}
