import { Task } from '../definitions';
import { lift, series, raises, print, log } from '../tasks';
import { stripIndent as indent } from 'common-tags';
import { flags, safePairs } from 'cli-belt';
import chalk from 'chalk';
import arg from 'arg';

export default async function bin(
  record: Task.Record,
  argv: string[]
): Promise<Task> {
  const help = indent`
    ${chalk.bold('Lifts kpo tasks to a package.json')}

    Usage:
      $ kpo :lift [options]

    Options:
      --purge          Purge all non-kpo scripts
      --mode           Lift mode of operation
      -h, --help       Show help
  `;

  const types = {
    '--purge': Boolean,
    '--mode': String,
    '--help': Boolean
  };

  const { options, aliases } = flags(help);
  safePairs(types, options, { fail: true, bidirectional: true });
  Object.assign(types, aliases);
  const cmd = arg(types, { argv, permissive: false, stopAtPositional: true });

  if (cmd['--help']) return print(help + '\n');
  if (cmd._.length) {
    return series(
      print(help + '\n'),
      raises(Error(`Unknown subcommand: ${cmd._[0]}`))
    );
  }

  if (
    !['default', 'confirm', 'dry', 'audit'].includes(cmd['--mode'] || 'default')
  ) {
    return raises(Error(`Lift mode must be default, confirm, dry, or audit`));
  }

  return series(
    log('debug', 'Working directory:', process.cwd()),
    log('info', chalk.bold('kpo'), chalk.bold.blue(':lift')),
    print(),
    lift(record, {
      purge: cmd['--purge'],
      mode: cmd['--mode'] as any
    })
  );
}
