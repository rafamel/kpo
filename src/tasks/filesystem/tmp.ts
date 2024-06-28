import type { Buffer } from 'node:buffer';
import path from 'node:path';
import os from 'node:os';

import type { Empty, MaybePromise, Serial } from 'type-core';
import { shallow } from 'merge-strategies';
import fs from 'fs-extra';

import type { Context, Task } from '../../definitions';
import { constants } from '../../constants';
import { isCancelled, onCancel } from '../../utils/cancellation';
import { create } from '../creation/create';
import { series } from '../aggregate/series';
import { finalize } from '../exception/finalize';
import { log } from '../stdio/log';
import { write } from './write';

export interface TmpOptions {
  /** Extension to use for the temporal file */
  ext?: string | null;
}

/**
 * Creates a temporal file with the result of `content`;
 * when it is an object, it will be stringified as JSON.
 * Passes the temporal file path to a `callback`, which
 * can return a `Task`.
 * @returns Task
 */
export function tmp(
  content: (context: Context) => MaybePromise<Buffer | Serial.Type>,
  callback: (path: string) => MaybePromise<Task | Empty>,
  options?: TmpOptions
): Task.Async {
  return create(async (ctx) => {
    const opts = shallow({ ext: null as string | null }, options || undefined);

    const buffer = await content(ctx);
    if (isCancelled(ctx)) return;

    const tmpdir = path.resolve(os.tmpdir(), constants.name);
    await fs.ensureDir(tmpdir);
    if (isCancelled(ctx)) return;

    const filename =
      'tmp-' +
      String(Math.random()).substring(2) +
      (opts.ext ? '.' + opts.ext.replace(/^\./, '') : '');
    const filepath = path.resolve(tmpdir, filename);

    const teardown = (): void => {
      try {
        fs.unlinkSync(filepath);
      } catch (err: any) {
        if (err.code !== 'ENOENT') throw err;
      }
    };

    const cleanup = onCancel(ctx, () => teardown());

    return finalize(
      series(
        log('debug', 'Tmp:', filename),
        write(filepath, buffer, { exists: 'error' }),
        create(() => callback(filepath))
      ),
      () => {
        cleanup();
        teardown();
      }
    );
  });
}
