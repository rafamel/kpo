/* eslint-disable no-console */
import { stripIndent as indent } from 'common-tags';
import arg from 'arg';
import { flags, safePairs } from 'cli-belt';
import { stream as command } from '~/public';

export default async function stream(argv: string[]): Promise<void> {
  const help = indent`
    Usage:
      $ kpo :stream [options] [commands]

    Streams kpo commands for children projects
    
    Options:
      --include <values>     Include children by name, comma separated
      --exclude <values>     Exclude children by name, comma separated
      --parallel             Execute streaming in parallel
      --force                Continue execution even if some process fails
      -h, --help       Show help
    
    Examples:
      $ kpo :stream :cmd foo --bar --baz
  `;

  const types = {
    '--include': String,
    '--exclude': String,
    '--parallel': Boolean,
    '--force': Boolean,
    '--help': Boolean
  };

  const { options, aliases } = flags(help);
  safePairs(types, options, { fail: true, bidirectional: true });
  Object.assign(types, aliases);
  const cmd = arg(types, { argv, permissive: false, stopAtPositional: true });

  if (cmd['--help']) return console.log(help);

  if (!cmd._.length) {
    console.log(help + '\n');
    throw Error(`A command is required`);
  }
  return command.fn(cmd._, {
    include: cmd['--include'] ? cmd['--include'].split(',') : undefined,
    exclude: cmd['--exclude'] ? cmd['--exclude'].split(',') : undefined,
    parallel: cmd['--parallel'],
    force: cmd['--force']
  });
}
