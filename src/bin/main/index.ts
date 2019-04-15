/* eslint-disable no-console */
import up from 'read-pkg-up';
import { stripIndent as indent } from 'common-tags';
import chalk from 'chalk';
import arg from 'arg';
import { flags, safePairs, log } from 'cli-belt';
import run from './run';

export default async function main(argv: string[]): Promise<void> {
  const { pkg } = await up();
  if (pkg.name) process.title = pkg.name;

  const help = indent`
    ${pkg.description ? chalk.bold.green(pkg.description) : ''}

    Usage:
      $ kpo [options] [scope] [tasks]
      $ kpo [:command] [options] [arguments]

    Options:
      --log <level>  Logging level
      -s, --silent   Silent fail -exits with code 0 on error
      -h, --help     Show help
      -v, --version  Show version number

    Commands:
      :run           Default command -it can be omitted
      :cmd, :        Run a command within a project context
      :series        Run commands in series within a project context
      :parallel      Run commands in parallel within a project context
      :list          List available tasks
      :raise         Raise tasks to package
      :prompt        Run a command for each possible user input choice
      :link          Link packages
  `;

  const types = {
    '--log': String,
    '--silent': Boolean,
    '--help': Boolean,
    '--version': Boolean
  };

  const { options, aliases } = flags(help);
  safePairs(types, options, { fail: true, bidirectional: true });
  Object.assign(types, aliases);
  const cmd = arg(types, { argv, permissive: false, stopAtPositional: true });

  // TODO manage silent and log
  if (cmd['--help']) return log(help);
  if (cmd['--version']) return log(pkg.version);
  if (!cmd._.length) return log(help, { exit: 1 });

  const args = cmd._.slice(1);
  // TODO
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
      return cmd._[0] === '@' ? console.log('TODO @scopes') : run(cmd._);
  }
}
