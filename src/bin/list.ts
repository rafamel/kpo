import { Task } from '../definitions';
import { list, series, raises, print, log } from '../tasks';
import { stripIndent as indent } from 'common-tags';
import { flags, safePairs } from 'cli-belt';
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
    ${chalk.bold(`Lists ${opts.bin} tasks`)}

    Usage:
      $ ${opts.bin} :list [options]

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

  return series(
    log('debug', 'Working directory:', process.cwd()),
    log('info', chalk.bold(opts.bin), chalk.bold.blue(':list')),
    print(),
    list(params.record, { defaults: cmd['--defaults'], bin: opts.bin })
  );
}
