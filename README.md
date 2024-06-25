# kpo

[![Version](https://img.shields.io/npm/v/kpo.svg)](https://www.npmjs.com/package/kpo)
[![Types](https://img.shields.io/npm/types/kpo.svg)](https://www.npmjs.com/package/kpo)
[![License](https://img.shields.io/github/license/rafamel/kpo.svg)](https://github.com/rafamel/kpo/blob/master/LICENSE)

> A task runner that goes where npm scripts won't, for the true [capo.](https://en.wiktionary.org/wiki/capo#Etymology_2)

## Install

Run [`npm install -g kpo`](https://www.npmjs.com/package/kpo) for a global install.

## Table of Contents

## Usage

*kpo* can be used programmatically or with its [CLI.](#cli-usage)

Tasks [(see definition)](https://rafamel.github.io/kpo/modules/Task.html) are plain synchronous or asynchronous functions that take a [`Context`](https://rafamel.github.io/kpo/modules/Context.html) as an argument.

Tasks can be used in an exclusively programmatic manner or with *kpo*'s CLI. The CLI expects a `kpo.tasks.js` file exporting a a [`Task.Record`](https://rafamel.github.io/kpo/interfaces/Task.Record.html) as a *default*.

`Context`s are used by tasks to determine things such as the current working directory, environment variables, cancellation state, logging level, or stdio streams. In that sense, tasks, at least those created with *kpo*'s creation functions, are independent of the process current state and can be cancelled. A task's context can in turn be manipulated to be different only for certain tasks, even within a group of serial or parallel tasks.

### Programmatic Usage

* Tasks
  * Creation
    * [`create`](https://rafamel.github.io/kpo/functions/create.html): a task creation helper.
    * [`context`](https://rafamel.github.io/kpo/functions/context): manipulates the context of a task.
  * Aggregate
    * [`series`](https://rafamel.github.io/kpo/functions/series): runs a group of tasks in series.
    * [`parallel`](https://rafamel.github.io/kpo/functions/parallel): runs a group of tasks in parallel.
    * [`combine`](https://rafamel.github.io/kpo/functions/combine): selects a task of group of tasks from a nested tasks record to run in series.
  * Exception
    * [`raises`](https://rafamel.github.io/kpo/functions/raises): raises an error.
    * [`catches`](https://rafamel.github.io/kpo/functions/catches): catches an error in a task and optionally run an alternate task.
    * [`finalize`](https://rafamel.github.io/kpo/functions/finalize): executes a task after another regardless of whether the first task errored.
  * Filesystem
    * [`mkdir`](https://rafamel.github.io/kpo/functions/mkdir): creates a directory.
    * [`write`](https://rafamel.github.io/kpo/functions/write): writes a file.
    * [`edit`](https://rafamel.github.io/kpo/functions/edit): edits a file.
    * [`copy`](https://rafamel.github.io/kpo/functions/copy): copies files or directories.
    * [`move`](https://rafamel.github.io/kpo/functions/move): moves files or directories.
    * [`remove`](https://rafamel.github.io/kpo/functions/remove): removes files or directories.
    * [`watch`](https://rafamel.github.io/kpo/functions/watch): watches for changes and runs a task for change events.
  * Process
    * [`exec`](https://rafamel.github.io/kpo/functions/exec): spawns a process.
  * Schedule
    * [`sleep`](https://rafamel.github.io/kpo/functions/sleep): stops execution for a given time.
    * [`repeat`](https://rafamel.github.io/kpo/functions/repeat): repeats a task for a number of times.
    * [`timeout`](https://rafamel.github.io/kpo/functions/timeout): sets a timeout for a task.
  * Stdio
    * [`log`](https://rafamel.github.io/kpo/functions/log): prints a message with a given logging level.
    * [`print`](https://rafamel.github.io/kpo/functions/print): prints a message.
    * [`clear`](https://rafamel.github.io/kpo/functions/clear): clears the *stdout.*
    * [`silence`](https://rafamel.github.io/kpo/functions/silence): suppresses the *stdio* for a task.
    * [`announce`](https://rafamel.github.io/kpo/functions/announce): logs a task route before execution and/or upon success.
    * [`interactive`](https://rafamel.github.io/kpo/functions/interactive): marks a task as interactive to error or run an alternate task on non-interactive environments.
    * [`progress`](https://rafamel.github.io/kpo/functions/progress): shows a spinner while the task is in progress.
    * [`prompt`](https://rafamel.github.io/kpo/functions/prompt): prompts for a user response.
    * [`confirm`](https://rafamel.github.io/kpo/functions/confirm): executes a task in response to user confirmation or rejection.
    * [`select`](https://rafamel.github.io/kpo/functions/select): executes a task in response to user selection.
  * Reflection
    * [`lift`](https://rafamel.github.io/kpo/functions/lift): lifts tasks on a record to a `package.json` file.
    * [`list`](https://rafamel.github.io/kpo/functions/list): prints all available tasks on a task record.
* Utils
  * [`run`](https://rafamel.github.io/kpo/functions/run): runs a task.
  * [`style`](https://rafamel.github.io/kpo/functions/style): styles a string.
  * [`fetch`](https://rafamel.github.io/kpo/functions/fetch): fetches a file with a tasks record as a default export.
  * [`recreate`](https://rafamel.github.io/kpo/functions/recreate): maps all tasks in a tasks record.
  * [`isCi`](https://rafamel.github.io/kpo/functions/isCi): indicates whether a context environment variables indicate it's running in a CI.
  * [`isCancelled`](https://rafamel.github.io/kpo/functions/isCancelled): resolves with the current cancellation state for a context.
  * [`isInteractive`](https://rafamel.github.io/kpo/functions/isInteractive): indicates whether a context is that of an interactive environment.
  * [`isLevelActive`](https://rafamel.github.io/kpo/functions/isLevelActive): indicates whether a logging level is enabled for a context.

### CLI Usage

#### Common options

These are common options for all *kpo* subcommands. They must always be passed before any subcommand or scope.

```
Usage:
  $ kpo [options] [command]

Options:
  -f, --file <path>       Configuration file
  -d, --dir <path>        Project directory
  -e, --env <value>       Environment variables
  --level <value>         Logging level
  --prefix                Prefix tasks output with their route
  -h, --help              Show help
  -v, --version           Show version number

Commands:
  :run          Runs tasks (default)
  :watch        Watch paths and run tasks on change events
  :list         List available tasks
  :lift         Lift tasks to package

Examples:
  $ kpo foo bar baz
  $ kpo -e NODE_ENV=development -e BABEL_ENV=node :run foo
```

#### `kpo :run`

Runs tasks.

`kpo :run` doesn't take additional options, other than the [common options.](#common-options)

Note that the `:run` command can be omitted. When no command is passed, *kpo* will assume you're passing it tasks to run. Hence, `kpo :run foo bar` and `kpo foo bar` are equivalent.

#### `kpo :watch`

```
Watch a path and run tasks on change events

Usage:
  $ kpo :watch [options] -- [args]

Options:
  -g, --glob              Parse globs in paths
  -p, --prime             Runs the task once when ready to wait for changes
  -f, --fail              Finalizes the watch effort if a given task fails
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
  $ kpo :watch -i ./src foo bar baz
  $ kpo :watch -i ./src -i ./test foo
  $ kpo -e NODE_ENV=development :watch -i ./src bar
```

#### `kpo :list`

```
List available tasks

Usage:
  $ kpo :list [options]

Options:
  --defaults      List default tasks and subtasks by their own
  -h, --help      Show help
```

#### `kpo :lift`

```
Lift tasks to a package.json

Usage:
  $ kpo :lift [options]

Options:
  --purge             Purge all non-kpo scripts
  --defaults          Lift default tasks and subtasks by their own
  --mode <value>      Lift mode of operation (confirm, fix, dry, audit)
  -h, --help          Show help
```
