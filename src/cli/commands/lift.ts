import arg from 'arg';
import { flags, safePairs } from 'cli-belt';
import { stripIndent as indent } from 'common-tags';

import { Task, CLI } from '../../definitions';
import { style, fetch } from '../../utils';
import { lift as _lift, series, raises, print } from '../../tasks';

export async function lift(params: CLI.Extension.Params): Promise<Task> {
  const help = indent`
    ${style(`Lift tasks to a package.json`, { bold: true })}

    Usage:
      $ ${params.options.bin} :lift [options]

    Options:
      --purge             Purge all non-${params.options.bin} scripts
      --defaults          Lift default tasks and subtasks by their own
      --mode <value>      Lift mode of operation (confirm, fix, dry, audit)
      -h, --help          Show help
  `;

  const types = {
    '--purge': Boolean,
    '--defaults': Boolean,
    '--mode': String,
    '--help': Boolean
  };

  const { options, aliases } = flags(help);
  safePairs(types, options, { fail: true, bidirectional: true });
  Object.assign(types, aliases);
  const cmd = arg(types, {
    argv: params.argv,
    permissive: false,
    stopAtPositional: true
  });

  if (cmd['--help']) return print(help + '\n');
  if (cmd._.length) {
    return series(
      print(help + '\n'),
      raises(Error(`Unknown subcommand: ${cmd._[0]}`))
    );
  }

  if (
    !['confirm', 'fix', 'dry', 'audit'].includes(cmd['--mode'] || 'confirm')
  ) {
    return raises(Error(`Lift mode must be confirm, fix, dry, or audit`));
  }

  const tasks = await fetch({
    chdir: true,
    files: params.options.files,
    directory: params.options.directory,
    property: params.options.property
  });

  return series(
    print(),
    _lift(
      {
        purge: cmd['--purge'],
        defaults: cmd['--defaults'],
        mode: cmd['--mode'] as any,
        bin: params.options.bin,
        multitask: params.options.multitask
      },
      tasks
    )
  );
}
