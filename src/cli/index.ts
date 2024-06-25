import process from 'node:process';

import { TypeGuard } from 'type-core';
import notifier from 'update-notifier';

import type { CLI } from '../definitions';
import { constants } from '../constants';
import { execute, main } from './bin';
import { lift, list, run, watch } from './commands';

/**
 * Runs *kpo* CLI.
 */
export async function cli(options?: CLI.Options): Promise<void> {
  if (options?.update) {
    const update = {
      name: constants.cli.bin,
      version: constants.cli.version,
      tag: 'latest',
      global: true,
      ...(TypeGuard.isBoolean(options.update) ? {} : options.update)
    };

    notifier({
      pkg: { name: update.name, version: update.version },
      distTag: update.tag,
      shouldNotifyInNpmScript: false,
      updateCheckInterval: 1000 * 60 * 60 * 24
    }).notify({
      defer: false,
      isGlobal: update.global
    });
  }

  return execute(() => {
    return main(process.argv.slice(2), {
      bin: options?.bin || constants.cli.bin,
      files: options?.files || constants.cli.files,
      property: options?.property || constants.cli.property,
      version: options?.version || constants.cli.version,
      description: options?.description || constants.cli.description,
      multitask: options?.multitask || constants.cli.multitask,
      extensions: [
        {
          name: 'run',
          description: 'Runs tasks',
          execute: run
        },
        {
          name: 'watch',
          description: 'Watch paths and run tasks on change events',
          execute: watch
        },
        {
          name: 'list',
          description: 'List available tasks',
          execute: list
        },
        {
          name: 'lift',
          description: 'Lift tasks to package',
          execute: lift
        },
        ...(options?.extensions || [])
      ]
    });
  });
}
