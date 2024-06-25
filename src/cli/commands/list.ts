import arg from 'arg';
import { flags, safePairs } from 'cli-belt';
import { stripIndent as indent } from 'common-tags';

import type { CLI, Task } from '../../definitions';
import { fetch, style } from '../../utils';
import { list as _list, print, raises, series } from '../../tasks';

export async function list(params: CLI.Extension.Params): Promise<Task> {
  const help = indent`
    ${style(`List available tasks`, { bold: true })}

    Usage:
      $ ${params.options.bin} :list [options]

    Options:
      --defaults      List default tasks and subtasks by their own
      -h, --help      Show help
  `;

  const types = {
    '--defaults': Boolean,
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
      raises(new Error(`Unknown subcommand: ${cmd._[0]}`))
    );
  }

  const tasks = await fetch({
    chdir: true,
    files: params.options.files,
    directory: params.options.directory,
    property: params.options.property
  });

  return series(
    print(),
    _list(
      {
        defaults: cmd['--defaults'],
        bin: params.options.bin
      },
      tasks
    )
  );
}
