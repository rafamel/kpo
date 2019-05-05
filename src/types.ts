import { LogLevelDesc } from 'loglevel';

/**
 * Represents an object with values of type `T`.
 */
export interface IOfType<T> {
  [key: string]: T;
}

/**
 * A logging level value, one of `'trace'`, `'debug'`, `'info'`, `'warn'`, `'error'`, `'silent'`.
 */
export type TLogger = LogLevelDesc;

/**
 * Represents a script or nested collection of scripts to be run:
 *  - *falsy* values (`undefined`, `null`, `false`) will not produce any effect.
 *  - A `string` will be taken as a command to be executed.
 *  - An `Error` will be thrown.
 *  - A `function` will be run and, if async, awaited for. It can optionally return another `TScript`, which will be run following the same rules. All functions can take an argument containing an array with the arguments passed to *kpo* after `--`, so for `kpo task -- foo bar`, we'd receive `['foo', 'bar']`.
 *  - A `TScript` array -as `IScriptsArray`- will be serially run following the same rules.
 *
 * ```javascript
 * const runMyScript = false;
 * const task = [
 *  runMyScript && () => console.log('Running'),
 *  'echo "foo"',
 *  true && console.log('Almost done'),
 *  (args) => {
 *    return (args.find(x => x === '--foo'))
 *      ? null
 *      : [() => 'echo "done"']
 *  },
 *  Error(`Task failed`)
 * ];
 * ```
 *
 * If the `task` above was a `kpo` task, it would run `echo "foo"`, `console.log('Almost done')`, `echo "done"`, and finally, error out. That being said, had we passed an argument `--foo` (`kpo task -- --foo`), then `echo "done"` wouldn't have run.
 */
export type TScript =
  | undefined
  | null
  | false
  | string
  | Error
  | TScriptFn
  | IScriptsArray;

/**
 * Represents a `TScript` as a function
 */
export type TScriptFn = (
  args?: string[]
) => TScript | void | Promise<TScript | void>;

/**
 * Represents a `TScript` array.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IScriptsArray extends Array<TScript> {}

/**
 * Object to be exported by the *kpo* scripts file if a `javascript` file, or in the `scripts` key otherwise.
 */
export interface IScripts {
  [key: string]: TScript | TScript[] | IScripts;
}

export interface IOptions {
  /**
   * Environment variables.
   */
  env?: IOfType<string>;
  /**
   * If `true`, *kpo* will always exit with code 0.
   */
  silent?: boolean;
  /**
   * Logging level, defaults to `'info'`.
   */
  log?: TLogger;
}

/**
 * Options to be passed to `options`, if your *kpo* file is a `javascript` file, or to define in the `options` key of your scripts file otherwise.
 */
export interface IScopeOptions extends IOptions {
  /**
   * Path for the root scope directory. By defult, it will be the closes parent directory to the current project which contains a `package.json` or *kpo* scripts file.
   */
  root?: string | null;
  /**
   * Paths . They can be defined as an array of globs, or otherwise an exclusive map of scope names and directories. See `TChildrenDefinition`. By default, it will be inferred if your project directory contains a `lerna.json` file from its `packages` key globs.
   */
  children?: TChildrenDefinition;
  /**
   * Used for relative paths resolution and as default `cwd` on command execution. It is also the directory scopes are resolved from.
   * By default, it will be the directory in which a sibling or parent `package.json` is found for the *kpo* scripts file, or the directory of the *kpo* file itself otherwise, unless a explicit `directory` is passed on the cli -see `ICliOptions`.
   * If it is a relative path itself, it will be resolved:
   *  - relative to the process `cwd` if passed on the cli.
   *  - relative to the `package.json` if set as an option there.
   *  - relative to the *kpo* scripts file if set there.
   */
  cwd?: string;
}

/**
 * Options that can live in the `kpo` key of a `package.json`.
 */
export interface IPackageOptions extends IScopeOptions {
  /**
   * The location of the *kpo* scripts file for the project.
   */
  file?: string | null;
}

/**
 * Options taken by the CLI.
 */
export interface ICliOptions extends IOptions {
  /**
   * The location of the *kpo* scripts file for the project.
   */
  file?: string | null;
  /**
   * Project directory, used to find the *kpo* scripts `file` or `package.json`, and as a default `cwd`.
   */
  directory?: string | null;
}

export type TCoreOptions = ICliOptions & IPackageOptions;

/**
 * A project children scopes, defined either:
 *  - As a string array, containing path globs to match.
 *  - As an object, with its keys being the scope names, and its values the directory for each scope.
 */
export type TChildrenDefinition = IOfType<string> | string[];

/**
 * Common options for commands execution.
 */
export interface IExecOptions {
  /**
   * Working directory. Defaults to the project directory.
   */
  cwd?: string;
  /**
   * Environment variables.
   */
  env?: IOfType<string>;
  /**
   * `stdio` mode.
   */
  stdio?: 'pipe' | 'ignore' | 'inherit';
}

/**
 * Options for serial and parallel commands execution
 */
export interface IMultiExecOptions extends IExecOptions {
  /**
   * If `true`, execution of other processes will continue even if one fails
   */
  force?: boolean;
  /**
   * If `true`, it will never throw.
   */
  silent?: boolean;
  /**
   * Arguments to pass to all commands
   */
  args?: string[];
}
