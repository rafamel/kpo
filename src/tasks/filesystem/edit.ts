import { Buffer } from 'node:buffer';

import { shallow } from 'merge-strategies';
import fs from 'fs-extra';

import type { Callable, Promisable, Serial } from '../../types';
import type { Context, Task } from '../../definitions';
import { getPaths, useSource } from '../../helpers/paths';
import { isCancelled } from '../../utils/cancellation';
import { series } from '../aggregate/series';
import { log } from '../stdio/log';

export interface EditOptions {
  /** Parse globs in paths */
  glob?: boolean;
  /** Disallows non existent paths and an empty set of paths */
  strict?: boolean;
}

export interface EditParams {
  buffer: Buffer;
  location: string;
}

/**
 * Reads files as specified in `paths`, calling the `cb`
 * callback with a Buffer for each file read.
 * The callback's responses will be written into the
 * original file path.
 * If the callback returns an object, it will be
 * stringified as JSON.
 * @returns Task
 */
export function edit(
  paths: string | string[],
  callback: Callable<EditParams, Promisable<Buffer | Serial>>,
  options?: EditOptions
): Task.Async {
  return series(
    log('debug', 'Edit:', paths),
    async (ctx: Context): Promise<void> => {
      const opts = shallow(
        { glob: false, strict: false },
        options || undefined
      );
      const sources = await getPaths(paths, ctx, {
        glob: opts.glob,
        strict: opts.strict
      });

      for (const source of sources) {
        if (isCancelled(ctx)) return;

        await useSource(source, ctx, { strict: opts.strict }, async () => {
          const buffer = await fs.readFile(source);
          const content = await callback({ buffer, location: source });

          if (isCancelled(ctx)) return;

          const data = Buffer.isBuffer(content)
            ? content
            : typeof content === 'object'
              ? JSON.stringify(content, null, 2)
              : String(content);
          await fs.writeFile(source, data);
        });
      }
    }
  );
}
