# *kpo*

[![Version](https://img.shields.io/npm/v/kpo.svg)](https://www.npmjs.com/package/kpo)
[![Build Status](https://img.shields.io/travis/rafamel/kpo.svg)](https://travis-ci.org/rafamel/kpo)
[![Coverage](https://img.shields.io/coveralls/rafamel/kpo.svg)](https://coveralls.io/github/rafamel/kpo)
[![Dependencies](https://img.shields.io/david/rafamel/kpo.svg)](https://david-dm.org/rafamel/kpo)
[![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/kpo.svg)](https://snyk.io/test/npm/kpo)
[![License](https://img.shields.io/github/license/rafamel/kpo.svg)](https://github.com/rafamel/kpo/blob/master/LICENSE)
[![Types](https://img.shields.io/npm/types/kpo.svg)](https://www.npmjs.com/package/kpo)

> A task runner that goes where npm scripts won't, for the true [capo.](https://en.wiktionary.org/wiki/capo#Etymology_2)

If you find it useful, consider [starring the project](https://github.com/rafamel/kpo) 💪 and/or following [its author](https://github.com/rafamel) ❤️ -there's more on the way!

***kpo* is still to be considered experimental; use with caution.**

## Install

To install *kpo* globally, run: [`npm install -g kpo`](https://www.npmjs.com/package/kpo)

## Documentation

[Full docs for exported utils are available here](https://rafamel.github.io/kpo/globals.html)

## Commands

### CLI options

These are common options for all *kpo* subcommands. They must always be passed before any subcommand or scope.

```
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
```

### `kpo :run` - default command

`kpo :run` doesn't take additional options, other than the general [CLI options.](#kpo-cli-options)

Note that **the `:run` command can be omitted,** that is, if no command is passed, *kpo* will assume you're passing it tasks to run. Hence, `kpo :run foo bar` and `kpo foo bar` are equivalent.

### `kpo :cmd` - aliased `kpo :`

```
Usage:
  $ kpo :cmd [options] [command] [arguments]

Runs a command

Options:
  -h, --help       Show help

Examples:
  $ kpo : foo --bar --baz
  $ kpo :cmd foo --bar --baz
```

### `kpo :list`

```
Usage:
  $ kpo :list [options]

Lists tasks

Options:
  --all            List all, including hidden tasks
  --scopes         List scopes
  -h, --help       Show help
```

### `kpo :raise`

```
Usage:
  $ kpo :raise [options]

Raises kpo tasks to package.json

Options:
  --confirm        Prompt for changes confirmation before performing a write operation
  --dry            Dry run
  --fail           Fails if there are any changes to be made on dry mode, or if the user cancels the action when confirmation is required
  -h, --help       Show help
```

### `kpo :series`

```
Usage:
  $ kpo :series [options] [commands] -- [streamArgs]

Runs commands in series

Options:
  --force          Continue serial execution even if a process fails
  -h, --help       Show help

Examples:
  $ kpo :series "foo --bar" "baz --foobar"
```

### `kpo :parallel`

```
Usage:
  $ kpo :parallel [options] [commands] -- [streamArgs]

Runs commands in parallel

Options:
  -n, --names <values>      Comma separated names
  -c, --colors <values>     Comma separated colors
  --force                   Don't kill all other processes if any fails
  -h, --help                Show help

Examples:
  $ kpo :parallel -n foo,baz -c blue,magenta "foo --bar" "baz --foobar"
```
