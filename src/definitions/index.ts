import { Members } from 'type-core';
import { Writable, Readable } from 'stream';

/**
 * A task, that being a `Context` receiving
 * function, optionally async.
 */
export type Task = (context: Context) => Promise<void> | void;

export declare namespace Task {
  export type Sync = (context: Context) => void;
  export type Async = (context: Context) => Promise<void>;
  export interface Record {
    [key: string]: Task | Record;
  }
}

/**
 * Task Context definition.
 */
export interface Context {
  /**
   * A task's working directory.
   * Used as root for paths in file
   * operations and for spawned processes.
   */
  readonly cwd: string;
  /**
   * A task's evironment variables.
   * Used for spawned processes.
   */
  readonly env: Members<string | undefined>;
  /**
   * A task's arguments.
   * Used for spawned processes.
   */
  readonly args: string[];
  /**
   * A task's *stdin, stdout* and *stderr*.
   */
  readonly stdio: Stdio;
  /**
   * A task's log level.
   */
  readonly level: LogLevel;
  /**
   * A task's route.
   */
  readonly route: string[];
  /**
   * Whether a task will prefix all
   * lines of its *stdout* and *stderr* writes
   * with the stringification of its route.
   */
  readonly prefix: PrefixPolicy;
  /**
   * A *Promise* representing a task's
   * cancellation token.
   * Tasks should cancel when it resolves.
   */
  readonly cancellation: Promise<void>;
}

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent';

export type PrefixPolicy = 'none' | 'print' | 'exec' | 'all';

export type Stdio = [Readable, Writable, Writable];
