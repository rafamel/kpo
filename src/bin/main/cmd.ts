/* eslint-disable no-console */
import { stripIndent as indent } from 'common-tags';
import arg from 'arg';
import { flags, safePairs } from 'cli-belt';
import core from '~/core';

export default async function series(argv: string[]): Promise<void> {
  const help = indent`
    Usage:
      $ kpo :cmd [options] [command] [arguments]

    Runs a command
    
    Options:
      -h, --help       Show help
    
    Examples:
      $ kpo : foo --bar --baz
      $ kpo :cmd foo --bar --baz
  `;

  const types = {
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
  return core().exec(cmd._[0], cmd._.slice(1), false);
}
