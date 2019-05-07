/* eslint-disable no-console */
import { stripIndent as indent } from 'common-tags';
import arg from 'arg';
import { flags, safePairs } from 'cli-belt';
import { list as command } from '~/commands';

export default async function list(argv: string[]): Promise<void> {
  const help = indent`
    Usage:
      $ kpo :list [options]

    Lists tasks
    
    Options:
      --all            List all, including hidden tasks
      --scopes         List scopes
      -h, --help       Show help
  `;

  const types = {
    '--all': Boolean,
    '--scopes': Boolean,
    '--help': Boolean
  };

  const { options, aliases } = flags(help);
  safePairs(types, options, { fail: true, bidirectional: true });
  Object.assign(types, aliases);
  const cmd = arg(types, { argv, permissive: false, stopAtPositional: true });

  if (cmd['--help']) return console.log(help);
  if (cmd._.length) throw Error('Unknown command: ' + cmd._[0]);

  return command.fn({
    all: cmd['--all'],
    scopes: cmd['--scopes']
  });
}
