import type { Readable, Writable } from 'node:stream';

import type { Dictionary, Promisable } from '../types';

/**
 * A task, that being a `Context` receiving
 * function, optionally async.
 */
export type Task = (context: Context) => Promisable<void>;

export declare namespace Task {
  type Sync = (context: Context) => void;
  type Async = (context: Context) => Promise<void>;
  interface Record {
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
   * A task's environment variables.
   * Used for spawned processes.
   */
  readonly env: Dictionary<string | null>;
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
  readonly prefix: PrefixPolicy | boolean;
  /**
   * An AbortSignal for task cancellation.
   * Tasks should cancel when it emits.
   */
  readonly cancellation: AbortSignal;
}

export declare namespace Context {
  interface Interactive extends Context {
    readonly stdio: [NodeJS.ReadStream, NodeJS.WriteStream, Writable | null];
  }
}

export type PrefixPolicy = 'none' | 'print' | 'exec' | 'all';

export type Stdio = [Readable | null, Writable | null, Writable | null];

export type LogLevel = LogLevel.None | LogLevel.Core;
export declare namespace LogLevel {
  type None = 'silent';
  type Core = 'error' | 'warn' | 'success' | 'info' | 'debug' | 'trace';
}
