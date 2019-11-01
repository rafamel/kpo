/* eslint-disable no-console */
import { loadPackage, flags, safePairs, splitBy } from 'cli-belt';
import { stripIndent as indent } from 'common-tags';
import arg from 'arg';
import chalk from 'chalk';
import { commandJoin as join } from 'command-join';
import contain from '~/core';
import { TLogger, IOfType } from '~/types';
import { run } from '~/commands';
import _cmd from './cmd';
import series from './series';
import parallel from './parallel';
import list from './list';
import raise from './raise';
import stream from './stream';
import logger, { setLevel } from '~/utils/logger';

export default async function main(argv: string[]): Promise<void> {
  const pkg = await loadPackage(__dirname, { title: true });

  const help = indent`
    ${pkg.description ? chalk.bold.yellow(pkg.description) : ''}

    Usage:
      $ kpo [options] [@scope] [tasks] -- [streamArgs]
      $ kpo [options] [@scope] [:command] [arguments]

    Options:
      -f, --file <path>       Configuration file
      -d, --dir <path>        Project directory
      -e, --env <value>       Environment variables for spawned processes
      -s, --silent            Silent fail -exits with code 0 on error
      --log <level>           Logging level
      -h, --help              Show help
      -v, --version           Show version number

    Commands:
      :run           Default command -it can be omitted
      :cmd, :        Run a command within a project context
      :list          List available tasks
      :raise         Raise tasks to package
      :series        Run commands in series within a project context
      :parallel      Run commands in parallel within a project context
      :stream        Stream tasks or commands on children scopes

    Examples:
      $ kpo foo bar baz
      $ kpo -e NODE_ENV=development -e BABEL_ENV=browser :run foo bar baz
  `;

  const types = {
    '--file': String,
    '--dir': String,
    '--env': [String] as [StringConstructor],
    '--silent': Boolean,
    '--log': String,
    '--help': Boolean,
    '--version': Boolean
  };

  const { options: base, aliases } = flags(help);
  safePairs(types, base, { fail: true, bidirectional: true });
  Object.assign(types, aliases);
  const cmd = arg(types, { argv, permissive: false, stopAtPositional: true });

  if (cmd['--help']) return console.log(help);
  if (cmd['--version']) return console.log(pkg.version || 'Unknown');
  if (!cmd._.length) {
    console.log(help + '\n');
    throw Error(`A command is required`);
  }

  const options = {
    file: cmd['--file'],
    directory: cmd['--dir'],
    silent: cmd['--silent'],
    log: cmd['--log'] as TLogger,
    env: (cmd['--env'] || []).reduce((acc: IOfType<string>, str) => {
      const arr = str.split('=');
      if (arr.length !== 2) {
        throw Error(`Environment variables must have format VARIABLE=value`);
      }
      acc[arr[0]] = arr[1];
      return acc;
    }, {})
  };
  if (options.log) setLevel(options.log);

  let first = cmd._.shift();
  const scopes: string[] = [];
  while (!first || first[0] === '@') {
    if (!first) {
      console.log(help + '\n');
      throw Error(`A command is required`);
    }
    const command = first.split(':');
    const scope = command.shift() as string;
    scopes.push(scope === '@' ? 'root' : scope.slice(1));
    first = command.length
      ? `:${command.join(':')}`
      : (cmd._.shift() as string);
  }

  // Normalize command on special cases (: and no command)
  if (first === ':') first = ':cmd';
  else if (first[0] !== ':') {
    cmd._.unshift(first);
    first = ':run';
  }

  // Log full command to be run w/ resolved scopes
  logger.info(
    chalk.bold('kpo') +
      (scopes.length ? chalk.bold.yellow(' @' + scopes.join(' @')) : '') +
      chalk.bold.blue(' ' + first + ' ') +
      (cmd._.slice(-1)[0] === '--' ? join(cmd._.slice(0, -1)) : join(cmd._))
  );

  await contain(options, async function(core): Promise<void> {
    core = await core.scope(scopes);

    switch (first) {
      case ':run': {
        const [tasks, args] = splitBy(cmd._);
        return run(core, tasks, args);
      }
      case ':list': {
        return list(core, cmd._);
      }
      case ':raise': {
        return raise(core, cmd._);
      }
      case ':cmd': {
        return _cmd(cmd._);
      }
      case ':series': {
        return series(cmd._);
      }
      case ':parallel': {
        return parallel(cmd._);
      }
      case ':stream': {
        return stream(core, cmd._);
      }
      default: {
        throw Error('Unknown command ' + first);
      }
    }
  });
}
