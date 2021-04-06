import { deep } from 'merge-strategies';
import { constants } from '../constants';
import { CLI } from '../definitions';
import { main, execute } from './bin';
import { run, watch, list, lift } from './commands';

/**
 * Runs *kpo* CLI.
 */
export async function cli(options?: CLI.Options): Promise<void> {
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
