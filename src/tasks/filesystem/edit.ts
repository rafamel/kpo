import { Buffer } from 'node:buffer';

import type { Serial } from 'type-core';
import { shallow } from 'merge-strategies';
import fs from 'fs-extra';

import type { Context, Task } from '../../definitions';
import { getPaths, useSource } from '../../helpers/paths';
import { isCancelled } from '../../utils/is-cancelled';
import { series } from '../aggregate/series';
import { log } from '../stdio/log';

export interface EditOptions {
  /** Parse globs in paths */
  glob?: boolean;
  /** Disallows non existent paths and an empty set of paths */
  strict?: boolean;
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
  cb: (
    buffer: Buffer,
    path: string
  ) => Buffer | Serial.Type | Promise<Buffer | Serial.Type>,
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
        if (await isCancelled(ctx)) return;

        await useSource(source, ctx, { strict: opts.strict }, async () => {
          const buffer = await fs.readFile(source);
          const content = await cb(buffer, source);

          if (await isCancelled(ctx)) return;

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
