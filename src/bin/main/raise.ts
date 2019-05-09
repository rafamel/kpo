/* eslint-disable no-console */
import { stripIndent as indent } from 'common-tags';
import arg from 'arg';
import { flags, safePairs } from 'cli-belt';
import { raise as command } from '~/commands';
import { ICore } from '~/core';

export default async function list(core: ICore, argv: string[]): Promise<void> {
  const help = indent`
    Usage:
      $ kpo :raise [options]

    Raises kpo tasks to package.json
    
    Options:
      --purge          Purge all non-kpo scripts
      --confirm        Prompt for changes confirmation before performing a write operation
      --dry            Dry run
      --fail           Fails if there are any changes to be made on dry mode, or if the user cancels the action when confirmation is required
      -h, --help       Show help
  `;

  const types = {
    '--purge': Boolean,
    '--confirm': Boolean,
    '--dry': Boolean,
    '--fail': Boolean,
    '--help': Boolean
  };

  const { options, aliases } = flags(help);
  safePairs(types, options, { fail: true, bidirectional: true });
  Object.assign(types, aliases);
  const cmd = arg(types, { argv, permissive: false, stopAtPositional: true });

  if (cmd['--help']) return console.log(help);
  if (cmd._.length) throw Error('Unknown command: ' + cmd._[0]);

  return command(core, {
    purge: cmd['--purge'],
    confirm: cmd['--confirm'],
    dry: cmd['--dry'],
    fail: cmd['--fail']
  });
}
