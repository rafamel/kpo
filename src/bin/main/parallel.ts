/* eslint-disable no-console */
import { stripIndent as indent } from 'common-tags';
import arg from 'arg';
import { flags, safePairs, splitBy } from 'cli-belt';
import { parallel as command } from '~/public';

export default async function parallel(argv: string[]): Promise<void> {
  const help = indent`
    Usage:
      $ kpo :parallel [options] [commands] -- [streamArgs]

    Runs commands in parallel
    
    Options:
      -n, --names <values>      Comma separated names
      -c, --colors <values>     Comma separated colors
      --force                   Don't kill all other processes if any fails
      -h, --help                Show help
    
    Examples:
      $ kpo :parallel -n foo,baz -c blue,magenta "foo --bar" "baz --foobar"
  `;

  const types = {
    '--names': String,
    '--colors': String,
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
    names: cmd['--names'] ? cmd['--names'].split(',') : undefined,
    colors: cmd['--colors'] ? cmd['--colors'].split(',') : undefined,
    force: cmd['--force'],
    silent: false
  })(args);
}
