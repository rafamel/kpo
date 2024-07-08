import type { Buffer } from 'node:buffer';
import path from 'node:path';
import os from 'node:os';

import { TypeGuard } from 'type-core';
import { nanoid } from 'nanoid';
import fs from 'fs-extra';

import type { Callable, Promisable, Serial } from '../../types';
import type { Task } from '../../definitions';
import { constants } from '../../constants';
import { isCancelled, onCancel } from '../../utils/cancellation';
import { create } from '../creation/create';
import { series } from '../aggregate/series';
import { finalize } from '../exception/finalize';
import { write } from './write';
import { mkdir } from './mkdir';

export interface TmpFile {
  name: string;
  content: Buffer | Serial;
}

export interface TmpParams {
  files: string[];
  directory: string;
}

/**
 * Creates a temporal `directory` and places there
 * all `TmpFile`s returned by the `files` callback.
 * When `TmpFile.content` is an object, it will be
 * stringified as JSON.
 * Passes the paths of temporal `directory` and
 * files to a `callback`, which can return a `Task`.
 * @returns Task
 */
export function tmp(
  files:
    | null
    | TmpFile
    | TmpFile[]
    | Callable<void, Promisable<null | TmpFile | TmpFile[]>>,
  callback: Callable<TmpParams, Promisable<Task | null>>
): Task.Async {
  return create(async (ctx) => {
    const response = TypeGuard.isFunction(files) ? await files() : files;
    if (isCancelled(ctx)) return;

    const tmpdir = path.join(os.tmpdir(), constants.name, 'tmp-' + nanoid());
    const teardown = (): void => fs.removeSync(tmpdir);
    const cleanup = onCancel(ctx, () => teardown());

    const arr = (Array.isArray(response) ? response : [response])
      .filter((file): file is TmpFile => Boolean(file))
      .map((file) => ({
        filepath: path.join(tmpdir, file.name),
        content: file.content
      }));

    return finalize(
      series(
        mkdir(tmpdir, { ensure: true }),
        ...arr.map(({ filepath, content }) => {
          return write(filepath, content, { exists: 'error' });
        }),
        create(() => {
          return callback({
            directory: tmpdir,
            files: arr.map(({ filepath }) => filepath)
          });
        })
      ),
      () => {
        cleanup();
        teardown();
      }
    );
  });
}
