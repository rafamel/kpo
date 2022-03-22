import arg from 'arg';
import { flags, safePairs, splitBy } from 'cli-belt';
import { stripIndent as indent } from 'common-tags';

import { Task, CLI } from '../../definitions';
import { style, fetch } from '../../utils';
import { stringifyArgvCommands } from '../../helpers/stringify';
import {
  watch as _watch,
  series,
  raises,
  print,
  context,
  create,
  combine,
  log
} from '../../tasks';

export async function watch(params: CLI.Extension.Params): Promise<Task> {
  const bin = params.options.bin;
  const help = indent`
    ${style(`Watch a path and run tasks on change events`, {
      bold: true
    })}

    Usage:
      $ ${bin} :watch [options]${params.options.multitask ? ' -- ' : ' '}[args]

    Options:
      -g, --glob              Parse globs in paths
      -p, --prime             Runs the task once when ready to wait for changes
      -f, --fail              Finalizes the watch effort if a given task fails
      -c, --clear             Clear stdout before tasks execution
      -i, --include <value>   Paths to include
      -e, --exclude <value>   Paths to exclude
      -s, --symlinks          Follow symlinks
      --parallel              Don't cancel running tasks
      --debounce <number>     Avoid rapid task restarts (ms)
      --depth <number>        Limit subdirectories to traverse
      --poll <number>         Use polling for every ms interval
      -h, --help              Show help

    Examples:
      $ ${bin} :watch -i ./src ${params.options.multitask ? 'foo bar' : 'foo'}
      $ ${bin} :watch -i ./src -i ./test foo
      $ ${bin} -e NODE_ENV=development :watch -i ./src bar
  `;

  const types = {
    '--glob': Boolean,
    '--prime': Boolean,
    '--fail': Boolean,
    '--clear': Boolean,
    '--include': [String] as [StringConstructor],
    '--exclude': [String] as [StringConstructor],
    '--parallel': Boolean,
    '--symlinks': Boolean,
    '--debounce': Number,
    '--depth': Number,
    '--poll': Number,
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

  let first = true;
  const [names, args] = params.options.multitask
    ? splitBy(cmd._, '--')
    : [cmd._.slice(0, 1), cmd._.slice(1)];

  if (!names.length) {
    return series(print(help + '\n'), raises(new Error(`A task is required`)));
  }

  const tasks = await fetch({
    chdir: true,
    files: params.options.files,
    directory: params.options.directory,
    property: params.options.property
  });

  return context(
    { args },
    _watch(
      {
        glob: cmd['--glob'],
        prime: cmd['--prime'],
        fail: cmd['--fail'],
        clear: cmd['--clear'],
        include: cmd['--include'],
        exclude: cmd['--exclude'],
        parallel: cmd['--parallel'],
        debounce: cmd['--debounce'],
        depth: cmd['--depth'],
        poll: cmd['--poll'],
        symlinks: cmd['--symlinks']
      },
      series(
        create(() => {
          if (first) return (first = false) || null;
          return log(
            'info',
            style(params.options.bin, { bold: true }),
            style(':watch', { bold: true, color: 'blue' }),
            stringifyArgvCommands(params.argv)
          );
        }),
        combine({ include: names }, tasks)
      )
    )
  );
}
