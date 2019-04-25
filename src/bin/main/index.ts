/* eslint-disable no-console */
import { loadPackage, flags, safePairs } from 'cli-belt';
import { stripIndent as indent } from 'common-tags';
import arg from 'arg';
import chalk from 'chalk';
import options from '~/options';
import core from '~/core';
import { TLogger, IOfType } from '~/types';
import run from '~/commands/run';
import logger from '~/utils/logger';

export default async function main(argv: string[]): Promise<void> {
  const pkg = await loadPackage(__dirname, { title: true });

  const help = indent`
    ${pkg.description ? chalk.bold.yellow(pkg.description) : ''}

    Usage:
      $ kpo [options] [scope] [tasks]
      $ kpo [:command] [options] [arguments]

    Options:
      -f, --file <path>       Configuration file
      -d, --dir <path>        Project directory
      -e, --env <value>       Environment variables
      -s, --silent            Silent fail -exits with code 0 on error
      --log <level>           Logging level
      --node <value>          Sets node environment, shorthand for -e NODE_ENV=
      -h, --help              Show help
      -v, --version           Show version number

    Commands:
      :run           Default command -it can be omitted
      :cmd, :        Run a command within a project context
      :series        Run commands in series within a project context
      :parallel      Run commands in parallel within a project context
      :list          List available tasks
      :raise         Raise tasks to package
      :link          Link packages

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
    '--node': String,
    '--help': Boolean,
    '--version': Boolean
  };

  const { options: base, aliases } = flags(help);
  safePairs(types, base, { fail: true, bidirectional: true });
  Object.assign(types, aliases);
  const cmd = arg(types, { argv, permissive: false, stopAtPositional: true });

  if (cmd['--help']) return console.log(help);
  if (cmd['--version']) return console.log(pkg.version);
  if (!cmd._.length) {
    console.log(help + '\n');
    throw Error(`A command is required`);
  }

  options.setBase({
    file: cmd['--file'],
    directory: cmd['--dir'],
    silent: cmd['--silent'],
    log: cmd['--log'] as TLogger,
    env: (cmd['--env'] || [])
      .concat(cmd['--node'] ? `NODE_ENV=${cmd['--node']}` : [])
      .reduce((acc: IOfType<string>, str) => {
        const arr = str.split('=');
        if (arr.length !== 2) {
          throw Error(`Environment variables must have format VARIABLE=value`);
        }
        acc[arr[0]] = arr[1];
        return acc;
      }, {})
  });

  let first = cmd._.shift();
  while (!first || first[0] === '@') {
    if (!first) {
      console.log(help + '\n');
      throw Error(`A command is required`);
    }

    const command = first.split(':');
    const scope = command.shift() as string;

    await core.setScope(scope === '@' ? ['root'] : [scope.slice(1)]);

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
  const scopes = core.state.scopes;
  logger.info(
    `Running: ${chalk.bold('kpo')}` +
      (scopes.length ? chalk.bold.yellow(' @' + scopes.join(' @')) : '') +
      chalk.bold.blue(' ' + first) +
      (cmd._.length ? ` "${cmd._.join('" "')}"` : '')
  );

  // TODO
  switch (first) {
    case ':cmd':
      return console.log('TODO :cmd');
    case ':series':
      return console.log('TODO :series');
    case ':parallel':
      return console.log('TODO :parallel');
    case ':list':
      return console.log('TODO :list');
    case ':raise':
      return console.log('TODO :raise');
    case ':link':
      return console.log('TODO :link');
    case ':run':
      // add arguments after --
      return run(cmd._);
    default:
      throw Error('Unknown command ' + first);
  }
}
