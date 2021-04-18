import { TypeGuard } from 'type-core';
import notifier from 'update-notifier';
import { deep, shallow } from 'merge-strategies';
import { constants } from '../constants';
import { CLI } from '../definitions';
import { main, execute } from './bin';
import { run, watch, list, lift } from './commands';

/**
 * Runs *kpo* CLI.
 */
export async function cli(options?: CLI.Options): Promise<void> {
  if (options && options.update) {
    const update = shallow(
      {
        name: constants.cli.bin,
        version: constants.cli.version,
        tag: 'latest',
        global: true
      },
      TypeGuard.isRecord(options.update) ? options.update : undefined
    );
    notifier({
      pkg: { name: update.name, version: update.version },
      distTag: update.tag,
      shouldNotifyInNpmScript: true,
      updateCheckInterval: 1000 * 60 * 60 * 24
    }).notify({
      defer: false,
      isGlobal: update.global
    });
  }

  return execute(() => {
    return main(
      process.argv.slice(2),
      deep(
        {
          bin: constants.cli.bin,
          file: constants.cli.file,
          version: constants.cli.version,
          description: constants.cli.description,
          multitask: constants.cli.multitask,
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
            }
          ]
        },
        options || undefined
      )
    );
  });
}
