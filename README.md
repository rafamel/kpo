# kpo

[![Version](https://img.shields.io/npm/v/kpo.svg)](https://www.npmjs.com/package/kpo)
[![Build Status](https://img.shields.io/travis/rafamel/kpo/master.svg)](https://travis-ci.org/rafamel/kpo)
[![Coverage](https://img.shields.io/coveralls/rafamel/kpo/master.svg)](https://coveralls.io/github/rafamel/kpo)
[![Dependencies](https://img.shields.io/david/rafamel/kpo.svg)](https://david-dm.org/rafamel/kpo)
[![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/kpo.svg)](https://snyk.io/test/npm/kpo)
[![License](https://img.shields.io/github/license/rafamel/kpo.svg)](https://github.com/rafamel/kpo/blob/master/LICENSE)
[![Types](https://img.shields.io/npm/types/kpo.svg)](https://www.npmjs.com/package/kpo)

> A task runner that goes where npm scripts won't, for the true [capo.](https://en.wiktionary.org/wiki/capo#Etymology_2)

## Install

Run [`npm install -g kpo`](https://www.npmjs.com/package/kpo) for a global install.

## Commands

### CLI options

These are common options for all *kpo* subcommands. They must always be passed before any subcommand or scope.

```
Usage:
  $ kpo [options] [command]

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
  $ kpo foo bar baz
  $ kpo -e NODE_ENV=development -e BABEL_ENV=node :run foo bar baz
```

### `kpo :run`

Runs tasks.

`kpo :run` doesn't take additional options, other than the general [CLI options.](#cli-options)

Note that the `:run` command can be omitted. When no command is passed, *kpo* will assume you're passing it tasks to run. Hence, `kpo :run foo bar` and `kpo foo bar` are equivalent.

### `kpo :watch`

```
Watches a path and runs tasks on change events

Usage:
  $ kpo :watch [options]

Options:
  -g, --glob              Parse globs in paths
  -p, --prime             Runs the task once when ready to wait for changes
  -c, --clear             Clear stdout before tasks execution
  -i, --include <value>   Paths to include
  -e, --exclude <value>   Paths to exclude
  -s, --symlinks          Follow symlinks
  --parallel              Don't cancel running tasks
  --debounce <number>     Avoid rapid task restarts (ms)
  --depth <number>        Limit subdirectories to traverse
  --poll <number>         Use polling for every ms interval
  -h, --help              Show help

  Examples:
    $ kpo :watch -i ./src -i ./test foo bar baz
    $ kpo -e NODE_ENV=development :watch -i ./src foo bar baz
```

### `kpo :list`

```
Lists available tasks

Usage:
  $ kpo :list [options]

Options:
  --defaults      List default tasks and subtasks by their own
  -h, --help      Show help
```

### `kpo :lift`

```
Lifts tasks to a package.json

Usage:
  $ kpo :lift [options]

Options:
  --purge             Purge all non-kpo scripts
  --defaults          Lift default tasks and subtasks by their own
  --mode <value>      Lift mode of operation (default, confirm, dry, audit)
  -h, --help          Show help
```
