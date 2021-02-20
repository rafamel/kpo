import { Members } from 'type-core';
import { Writable, Readable } from 'stream';

export type Task = (context: Context) => Promise<void> | void;

export declare namespace Task {
  export type Sync = (context: Context) => void;
  export type Async = (context: Context) => Promise<void>;
  export interface Record {
    [key: string]: Task | Record;
  }
}

export interface Context {
  readonly cwd: string;
  readonly env: Members<string | undefined>;
  readonly args: string[];
  readonly stdio: Stdio;
  readonly level: LogLevel;
  readonly route: string[];
  readonly prefix: PrefixPolicy;
  readonly cancellation: Promise<void>;
}

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent';

export type PrefixPolicy = 'none' | 'print' | 'exec' | 'all';

export type Stdio = [Readable, Writable, Writable];
