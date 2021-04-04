import { Task } from '../definitions';
import { styleString } from '../helpers/style-string';
import { lift, series, raises, print, log } from '../tasks';
import { stripIndent as indent } from 'common-tags';
import { flags, safePairs } from 'cli-belt';
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
    ${styleString(`Lifts tasks to a package.json`, { bold: true })}

    Usage:
      $ ${opts.bin} :lift [options]

    Options:
      --purge             Purge all non-${opts.bin} scripts
      --defaults          Lift default tasks and subtasks by their own
      --mode <value>      Lift mode of operation (default, confirm, dry, audit)
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
    !['default', 'confirm', 'dry', 'audit'].includes(cmd['--mode'] || 'default')
  ) {
    return raises(Error(`Lift mode must be default, confirm, dry, or audit`));
  }

  return series(
    log('debug', 'Working directory:', process.cwd()),
    log(
      'info',
      styleString(opts.bin, { bold: true }),
      styleString(':lift', { bold: true, color: 'blue' })
    ),
    print(),
    lift(params.record, {
      purge: cmd['--purge'],
      defaults: cmd['--defaults'],
      mode: cmd['--mode'] as any,
      bin: opts.bin
    })
  );
}
