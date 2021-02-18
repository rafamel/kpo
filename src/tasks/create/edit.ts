import { Task, Context } from '../../definitions';
import { getPaths, useSource } from '../../helpers/paths';
import { isCancelled } from '../../utils';
import { log } from './log';
import { Serial } from 'type-core';
import { into } from 'pipettes';
import fs from 'fs-extra';

export interface EditOptions {
  glob?: boolean;
  strict?: boolean;
}

export function edit(
  paths: string | string[],
  cb: (
    buffer: Buffer,
    path: string
  ) => Buffer | Serial.Type | Promise<Buffer | Serial.Type>,
  options?: EditOptions
): Task.Async {
  return async (ctx: Context): Promise<void> => {
    into(ctx, log('debug', 'Edit:', paths));

    const opts = Object.assign({ glob: false, strict: false }, options);
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
  };
}
