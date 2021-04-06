import { LogLevel, Task } from '../definitions';
import { styleString } from '../helpers/style-string';
import { print, log, raises, series, context, combine } from '../tasks';
import { constants } from '../constants';
import { fetch } from '../utils';
import watch from './watch';
import list from './list';
import lift from './lift';
import { Members } from 'type-core';
import { flags, safePairs, splitBy } from 'cli-belt';
import { stripIndent as indent } from 'common-tags';
import { into } from 'pipettes';
import path from 'path';
import arg from 'arg';

interface Params {
  argv: string[];
}

interface Options {
  bin: string;
  file: string;
  description: string;
  version: string;
}

export default async function main(
  params: Params,
  opts: Options
): Promise<Task> {
  process.title = opts.bin;

  const help = indent`
    ${styleString(opts.description, { bold: true })}

    Usage:
      $ ${opts.bin} [options] [command]

    Options:
      -f, --file <path>       Configuration file
      -d, --dir <path>        Project directory
      -e, --env <value>       Environment variables
      --level <value>         Logging level
      --prefix                Prefix task output with its route
      -h, --help              Show help
      -v, --version           Show version number

    Commands:
      :run           Runs tasks (default)
      :watch         Watches paths and run tasks on change events
      :list          List available tasks
      :lift          Lift tasks to package

    Examples:
      $ ${opts.bin} foo bar baz
      $ ${opts.bin} -e NODE_ENV=development -e BABEL_ENV=node :run foo bar baz
  `;

  const types = {
    '--file': String,
    '--dir': String,
    '--env': [String] as [StringConstructor],
    '--level': String,
    '--prefix': Boolean,
    '--help': Boolean,
    '--version': Boolean
  };

  const { options: base, aliases } = flags(help);
  safePairs(types, base, { fail: true, bidirectional: true });
  Object.assign(types, aliases);
  const cmd = arg(types, {
    argv: params.argv,
    permissive: true,
    stopAtPositional: true
  });

  if (cmd['--help']) return print(help + '\n');
  if (cmd['--version']) return print(opts.version);
  if (!cmd._.length) {
    return series(
      print(help + '\n'),
      raises(Error(`A command or task is required`))
    );
  }

  if (
    cmd['--level'] &&
    !constants.collections.levels.includes(cmd['--level'].toLowerCase())
  ) {
    return raises(
      Error(
        'Logging level must be one of: ' +
          constants.collections.levels.join(', ')
      )
    );
  }

  const options = {
    file: cmd['--file'],
    dir: cmd['--dir'],
    level: cmd['--level'] as LogLevel,
    prefix: cmd['--prefix'],
    env: (cmd['--env'] || []).reduce((acc, str) => {
      const arr = str.split('=');
      if (arr.length !== 2) {
        throw Error(`Environment variables must have format VARIABLE=value`);
      }
      return { ...acc, [arr[0]]: arr[1] };
    }, {} as Members<string>)
  };

  const record = await fetch(
    options.file || opts.file,
    { dir: options.dir },
    (filepath) => {
      return process.chdir(options.dir || path.dirname(filepath));
    }
  );

  const withContext = context.bind(null, {
    env: { ...process.env, ...options.env },
    level: options.level,
    prefix: options.prefix
  });

  if (cmd._[0][0] !== ':') cmd._.unshift(':run');
  const command = cmd._.shift();
  switch (command) {
    case ':run': {
      const [names, args] = splitBy(cmd._, '--');
      return names.length
        ? into(
            series(
              log('debug', 'Working directory:', process.cwd()),
              log(
                'info',
                styleString(opts.bin, { bold: true }),
                styleString(':run', { bold: true, color: 'blue' }),
                names.join(' ')
              ),
              print(),
              combine(record, { include: names })
            ),
            context.bind(null, { args }),
            withContext
          )
        : series(
            print(help + '\n'),
            raises(Error(`A command or task is required`))
          );
    }
    case ':watch': {
      return into(
        await watch({ argv: cmd._, record: record }, { bin: opts.bin }),
        withContext
      );
    }
    case ':list': {
      return into(
        await list({ argv: cmd._, record: record }, { bin: opts.bin }),
        withContext
      );
    }
    case ':lift': {
      return into(
        await lift({ argv: cmd._, record: record }, { bin: opts.bin }),
        withContext
      );
    }
    default: {
      return series(
        print(help + '\n'),
        raises(Error(`Unknown command: ${command}`))
      );
    }
  }
}
