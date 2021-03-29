import { LogLevel, Task, PrefixPolicy } from '../definitions';
import { print, log, list, raises, series, context, combine } from '../tasks';
import { fetch } from '../utils';
import lift from './lift';
import { Members } from 'type-core';
import { loadPackage, flags, safePairs, splitBy } from 'cli-belt';
import { stripIndent as indent } from 'common-tags';
import { into } from 'pipettes';
import chalk from 'chalk';
import path from 'path';
import arg from 'arg';

interface Options {
  bin: string;
  file: string;
}

export default async function main(
  argv: string[],
  opts: Options
): Promise<Task> {
  const pkg = await loadPackage(__dirname, { title: true });

  const help = indent`
    ${pkg.description ? chalk.bold(pkg.description) : ''}

    Usage:
      $ ${opts.bin} [options] [command]

    Options:
      -f, --file <path>       Configuration file
      -d, --dir <path>        Project directory
      -e, --env <value>       Environment variables
      --prefix                Print task routes
      --level <value>         Logging level
      -h, --help              Show help
      -v, --version           Show version number

    Commands:
      :run           Default command -can be omitted
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
    '--prefix': Boolean,
    '--level': String,
    '--help': Boolean,
    '--version': Boolean
  };

  const { options: base, aliases } = flags(help);
  safePairs(types, base, { fail: true, bidirectional: true });
  Object.assign(types, aliases);
  const cmd = arg(types, { argv, permissive: true, stopAtPositional: true });

  if (cmd['--help']) return print(help + '\n');
  if (cmd['--version']) return print(pkg.version || 'Unknown');
  if (!cmd._.length) {
    return series(
      print(help + '\n'),
      raises(Error(`A command or task is required`))
    );
  }

  if (
    !['silent', 'error', 'warn', 'info', 'debug', 'trace'].includes(
      cmd['--level'] || 'info'
    )
  ) {
    return raises(
      Error(`Logging level must be silent, error, warn, info, debug, or trace`)
    );
  }

  const options = {
    file: cmd['--file'],
    dir: cmd['--dir'],
    level: cmd['--level'] as LogLevel,
    prefix: (cmd['--prefix'] ? 'all' : 'none') as PrefixPolicy,
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
                chalk.bold(opts.bin),
                chalk.bold.blue(':run'),
                names.join(' ')
              ),
              print(),
              combine(record, names)
            ),
            context.bind(null, { args }),
            withContext
          )
        : series(
            print(help + '\n'),
            raises(Error(`A command or task is required`))
          );
    }
    case ':list': {
      return cmd._.length
        ? series(
            print(help + '\n'),
            raises(Error(`Unknown subcommand: ${cmd._[0]}`))
          )
        : into(
            series(
              log('debug', 'Working directory:', process.cwd()),
              log('info', chalk.bold(opts.bin), chalk.bold.blue(':list')),
              print(),
              list(record)
            ),
            withContext
          );
    }
    case ':lift': {
      return into(await lift(record, cmd._, { bin: opts.bin }), withContext);
    }
    default: {
      return series(
        print(help + '\n'),
        raises(Error(`Unknown command: ${command}`))
      );
    }
  }
}
