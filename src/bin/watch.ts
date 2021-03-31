import { Task } from '../definitions';
import { series, raises, print, log, combine, watch, context } from '../tasks';
import { stripIndent as indent } from 'common-tags';
import { flags, safePairs, splitBy } from 'cli-belt';
import chalk from 'chalk';
import arg from 'arg';

interface Params {
  argv: string[];
  record: Task.Record;
}

interface Options {
  bin: string;
}

export default async function bin(
  params: Params,
  opts: Options
): Promise<Task> {
  const help = indent`
    ${chalk.bold(`Watches a path and runs ${opts.bin} tasks on change events`)}

    Usage:
      $ ${opts.bin} :watch [options]

    Options:
      -p, --path <value>      Paths to watch
      -g, --glob              Parse globs in paths
      -i, --initial           Run tasks on start, before changes
      -s, --symlinks          Follow symlinks
      --parallel              Don't cancel running tasks
      --debounce <number>     Avoid rapid task restarts (ms)
      --depth <number>        Limit subdirectories to traverse
      --poll <number>         Use polling for every ms interval
      -h, --help              Show help

      Examples:
        $ ${opts.bin} :watch -p ./src -p ./test foo bar baz
        $ ${opts.bin} -e NODE_ENV=development :watch -p ./src foo bar baz
  `;

  const types = {
    '--path': [String] as [StringConstructor],
    '--glob': Boolean,
    '--initial': Boolean,
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

  const [names, args] = splitBy(cmd._, '--');
  return names.length
    ? series(
        log('debug', 'Working directory:', process.cwd()),
        log(
          'info',
          chalk.bold(opts.bin),
          chalk.bold.blue(':watch'),
          names.join(' ')
        ),
        print(),
        watch(
          cmd['--path'] || './',
          {
            glob: cmd['--glob'],
            initial: cmd['--initial'],
            parallel: cmd['--parallel'],
            debounce: cmd['--debounce'],
            depth: cmd['--depth'],
            poll: cmd['--poll'],
            symlinks: cmd['--symlinks']
          },
          context({ args }, combine(params.record, names))
        )
      )
    : series(
        print(help + '\n'),
        raises(Error(`A command or task is required`))
      );
}
