import arg from 'arg';
import table from 'as-table';
import { into } from 'pipettes';
import { flags, safePairs } from 'cli-belt';
import { stripIndent as indent } from 'common-tags';
import { Task, LogLevel, CLI, Context } from '../../definitions';
import { stringifyArgvCommands } from '../../helpers/stringify';
import { resolveProject } from '../../helpers/resolve-project';
import {
  getLogLevels,
  isLogLevel,
  normalizeLogLevel
} from '../../helpers/logging';
import { print, raises, series, create, context, log } from '../../tasks';
import { constants } from '../../constants';
import { run, style } from '../../utils';

export function main(
  argv: string[],
  options: Required<Omit<CLI.Options, 'update'>>
): Task {
  const extensions = into(
    options.extensions,
    (all) => all.map((item) => item.name),
    (names) => {
      return options.extensions
        .filter((item, i) => names.indexOf(item.name) === i)
        .filter((item) => Boolean(item.execute));
    }
  );
  const help = into(
    indent`
      ${style(options.description, { bold: true })}

      Usage:
        $ ${options.bin} [options] [command]

      Options:
        -f, --file <path>       Configuration file
        -d, --dir <path>        Project directory
        -e, --env <value>       Environment variables
        --level <value>         Logging level
        --prefix                Prefix tasks output with their route
        -h, --help              Show help
        -v, --version           Show version number

      Commands:
    `,
    (str) => {
      const rows = extensions.map((item, i) => [
        '  ' + ':' + item.name,
        (item.description || '') + (!i ? ' (default)' : '')
      ]);
      return (
        str + '\n' + table.configure({ delimiter: ' '.repeat(8) })(rows) + '\n'
      );
    },
    (str) => {
      return (
        str +
        '\n' +
        indent`
          Examples:
            $ ${options.bin} ${options.multitask ? 'foo bar baz' : 'foo'}
            $ ${options.bin} -e NODE_ENV=development -e BABEL_ENV=node :run foo
        `
      );
    },
    (str) => str + '\n'
  );

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
    argv,
    permissive: true,
    stopAtPositional: true
  });

  /* Interrupting arguments */
  if (cmd['--help']) return print(help);
  if (cmd['--version']) return print(options.version);

  /* Parse options */
  let badEnvFormat = false;
  const opts = {
    file: cmd['--file'],
    directory: cmd['--dir'],
    prefix: cmd['--prefix'],
    level: isLogLevel(normalizeLogLevel(cmd['--level']))
      ? (normalizeLogLevel(cmd['--level']) as LogLevel)
      : constants.defaults.level,
    env: {
      ...process.env,
      ...(cmd['--env'] || []).reduce((acc, str) => {
        const arr = str.split('=');
        if (arr.length !== 2) badEnvFormat = true;
        return { ...acc, [arr[0]]: arr[1] };
      }, {})
    }
  };

  return into(
    create(async () => {
      /* Preconditions */
      if (badEnvFormat) {
        return series(
          print(help),
          raises(Error(`Environment variables must have format VARIABLE=value`))
        );
      }
      if (cmd['--level'] && cmd['--level'].toLowerCase() !== opts.level) {
        return series(
          print(help),
          raises(
            Error(`Logging level must be one of: ` + getLogLevels().join(', '))
          )
        );
      }
      if (!cmd._.length) {
        return series(print(help), raises(Error(`A command is required`)));
      }

      /* Parse extension */
      if (cmd._[0][0] !== ':') cmd._.unshift(':' + extensions[0].name);
      const name = (cmd._.shift() || ':').slice(1);
      const extension = extensions.filter((item) => item.name === name)[0];
      if (!extension) {
        return series(
          print(help),
          raises(Error('Unknown command' + name ? ': ' + name : ''))
        );
      }

      /* Resolve project */
      const project = await resolveProject({
        fail: false,
        file: opts.file || options.file,
        directory: opts.directory || null
      });

      /* Execute command */
      return series(
        log('debug', 'Working directory:', project.directory),
        log('debug', 'Arguments:', [':' + extension.name, ...cmd._]),
        log(
          'info',
          style(options.bin, { bold: true }),
          style(':' + extension.name, { bold: true, color: 'blue' }),
          stringifyArgvCommands(cmd._)
        ),
        context(
          { cwd: project.directory },
          create(
            extension.execute.bind(extension, {
              help,
              argv: cmd._,
              options: {
                bin: options.bin,
                file: project.file,
                directory: project.directory,
                multitask: options.multitask
              }
            })
          )
        )
      );
    }),
    (task) => {
      return async (ctx: Context): Promise<void> => {
        try {
          await run(ctx, task);
        } catch (err) {
          await run(ctx, log('trace', err));
          throw err;
        }
      };
    },
    context.bind(null, {
      env: opts.env,
      level: opts.level,
      prefix: opts.prefix
    })
  );
}
