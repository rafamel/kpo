import type { Buffer } from 'node:buffer';
import path from 'node:path';
import os from 'node:os';

import type { Empty, MaybePromise, Serial } from 'type-core';
import { nanoid } from 'nanoid';
import fs from 'fs-extra';

import type { Context, Task } from '../../definitions';
import { constants } from '../../constants';
import { isCancelled, onCancel } from '../../utils/cancellation';
import { create } from '../creation/create';
import { series } from '../aggregate/series';
import { finalize } from '../exception/finalize';
import { write } from './write';
import { mkdir } from './mkdir';

export interface TmpFile {
  name: string;
  content: Buffer | Serial.Type;
}

/**
 * Creates a temporal `directory` and places there
 * all `TmpFile`s returned by the `files` callback.
 * When `TmpFile.content` is an object, it will be
 * stringified as JSON.
 * Passes the temporal `directory` to a `callback`,
 * which can return a `Task`.
 * @returns Task
 */
export function tmp(
  files: (context: Context) => MaybePromise<null | TmpFile | TmpFile[]>,
  callback: (directory: string) => MaybePromise<Task | Empty>
): Task.Async {
  return create(async (ctx) => {
    const response = await files(ctx);
    if (isCancelled(ctx)) return;

    const tmpdir = path.join(os.tmpdir(), constants.name, 'tmp-' + nanoid());
    const teardown = (): void => fs.removeSync(tmpdir);
    const cleanup = onCancel(ctx, () => teardown());

    return finalize(
      series(
        mkdir(tmpdir, { ensure: true }),
        ...(Array.isArray(response) ? response : [response])
          .filter((file): file is TmpFile => Boolean(file))
          .map((file) => {
            return write(path.join(tmpdir, file.name), file.content, {
              exists: 'error'
            });
          }),
        create(() => callback(tmpdir))
      ),
      () => {
        cleanup();
        teardown();
      }
    );
  });
}
