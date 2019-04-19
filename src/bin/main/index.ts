/* eslint-disable no-console */
import { loadPackage, flags, safePairs } from 'cli-belt';
import { stripIndent as indent } from 'common-tags';
import arg from 'arg';
import chalk from 'chalk';
import run from './run';

export default async function main(argv: string[]): Promise<void> {
  const pkg = await loadPackage(__dirname, { title: true });

  const help = indent`
    ${pkg.description ? chalk.bold.yellow(pkg.description) : ''}

    Usage:
      $ kpo [options] [scope] [tasks]
      $ kpo [:command] [options] [arguments]

    Options:
      --log <level>           Logging level
      --node <environment>    Sets node environment, shorthand for -e NODE_ENV=
      -e, --env <value>       Environment variables
      -s, --silent            Silent fail -exits with code 0 on error
      -h, --help              Show help
      -v, --version           Show version number

    Commands:
      :run           Default command -it can be omitted
      :cmd, :        Run a command within a project context
      :series        Run commands in series within a project context
      :parallel      Run commands in parallel within a project context
      :list          List available tasks
      :raise         Raise tasks to package
      :prompt        Run a command for each possible user input choice
      :link          Link packages

    Examples:
      $ kpo foo bar baz
      $ kpo -e NODE_ENV=development -e BABEL_ENV=browser :run foo bar baz
  `;

  const types = {
    '--log': String,
    '--node': String,
    '--env': [String] as [StringConstructor],
    '--silent': Boolean,
    '--help': Boolean,
    '--version': Boolean
  };

  const { options, aliases } = flags(help);
  safePairs(types, options, { fail: true, bidirectional: true });
  Object.assign(types, aliases);
  const cmd = arg(types, { argv, permissive: false, stopAtPositional: true });

  if (cmd['--help']) return console.log(help);
  if (cmd['--version']) return console.log(pkg.version);
  if (!cmd._.length) return console.log(help, { exit: 1 });

  const args = cmd._.slice(1);
  const char = cmd._[0][0];

  // TODO
  if (char === '@') {
    return console.log('TODO @scopes');
  } else if (char === ':') {
    switch (cmd._[0]) {
      case ':':
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
      case ':prompt':
        return console.log('TODO :prompt');
      case ':link':
        return console.log('TODO :link');
      case ':run':
        return run(args);
      default:
        throw Error('Unknown command ' + cmd._[0]);
    }
  } else {
    return run(cmd._);
  }
}
