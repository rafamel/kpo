import arg from 'arg';
import { flags, safePairs } from 'cli-belt';
import { stripIndent as indent } from 'common-tags';
import { fetch } from '../../utils';
import { Task, CLI } from '../../definitions';
import { styleString } from '../../helpers/style-string';
import { list as _list, series, raises, print } from '../../tasks';

export async function list(params: CLI.Extension.Params): Promise<Task> {
  const help = indent`
    ${styleString(`List available tasks`, { bold: true })}

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
      raises(Error(`Unknown subcommand: ${cmd._[0]}`))
    );
  }

  const tasks = await fetch({
    chdir: true,
    file: params.options.file,
    directory: params.options.directory
  });

  return _list(tasks, {
    defaults: cmd['--defaults'],
    bin: params.options.bin
  });
}
