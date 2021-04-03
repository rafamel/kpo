import { Task } from '../definitions';
import { styleString } from '../helpers/style-string';
import {
  series,
  raises,
  print,
  log,
  combine,
  watch,
  context,
  bundle
} from '../tasks';
import { stripIndent as indent } from 'common-tags';
import { flags, safePairs, splitBy } from 'cli-belt';
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
    ${styleString(
      `Watches a path and runs ${opts.bin} tasks on change events`,
      { bold: true }
    )}

    Usage:
      $ ${opts.bin} :watch [options]

    Options:
      -g, --glob              Parse globs in paths
      -p, --prime             Runs the task once when ready to wait for changes
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
        $ ${opts.bin} :watch -i ./src -i ./test foo bar baz
        $ ${opts.bin} -e NODE_ENV=development :watch -i ./src foo bar baz
  `;

  const types = {
    '--glob': Boolean,
    '--prime': Boolean,
    '--include': [String] as [StringConstructor],
    '--exclude': [String] as [StringConstructor],
    '--clear': Boolean,
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
  const [names, args] = splitBy(cmd._, '--');
  return names.length
    ? context(
        { args },
        series(
          log('debug', 'Working directory:', process.cwd()),
          log(
            'info',
            styleString(opts.bin, { bold: true }),
            styleString(':watch', { bold: true, color: 'blue' }),
            names.join(' ')
          ),
          print(),
          watch(
            {
              glob: cmd['--glob'],
              prime: cmd['--prime'],
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
              bundle(() => {
                if (first) return (first = false) || null;
                return log(
                  'info',
                  styleString(opts.bin, { bold: true }),
                  styleString(':watch', { bold: true, color: 'blue' }),
                  names.join(' ')
                );
              }),
              combine(params.record, { include: names, defaults: true })
            )
          )
        )
      )
    : series(
        print(help + '\n'),
        raises(Error(`A command or task is required`))
      );
}
