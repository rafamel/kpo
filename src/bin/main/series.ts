/* eslint-disable no-console */
import { stripIndent as indent } from 'common-tags';
import arg from 'arg';
import { flags, safePairs, splitBy } from 'cli-belt';
import { series as command } from '~/public';

export default async function series(argv: string[]): Promise<void> {
  const help = indent`
    Usage:
      $ kpo :series [options] [commands] -- [streamArgs]

    Runs commands in series
    
    Options:
      --force          Continue serial execution even if a process fails
      -h, --help       Show help
    
    Examples:
      $ kpo :series "foo --bar" "baz --foobar"
  `;

  const types = {
    '--force': Boolean,
    '--help': Boolean
  };

  const { options, aliases } = flags(help);
  safePairs(types, options, { fail: true, bidirectional: true });
  Object.assign(types, aliases);
  const cmd = arg(types, { argv, permissive: false, stopAtPositional: true });

  if (cmd['--help']) return console.log(help);

  const [cmds, args] = splitBy(cmd._);
  if (!cmds.length) {
    console.log(help + '\n');
    throw Error(`A command is required`);
  }

  return command(cmds, {
    silent: false,
    force: cmd['--force']
  })(args);
}
