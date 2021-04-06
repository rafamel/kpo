import { Empty } from 'type-core';
import { Context, Task } from './tasks';

export declare namespace CLI {
  /** Global Options */
  export interface Options {
    /**
     * Name of kpo's executable.
     */
    bin?: string;
    /**
     * Default tasks file name
     */
    file?: string;
    /**
     * Executable version
     */
    version?: string;
    /**
     * Executable description
     */
    description?: string;
    /**
     * Whether to allow running multiple tasks.
     * When active, arguments for tasks
     * will be separated by '--'.
     */
    multitask?: boolean;
    /**
     * Additional commands
     */
    extensions?: Extension[];
  }

  /** Command Extensions */
  export interface Extension {
    name: string;
    description: string;
    execute: Extension.Execute;
  }
  export namespace Extension {
    export type Execute = (
      params: Params,
      context: Context
    ) => Task | Empty | Promise<Task | Empty>;
    export interface Params {
      help: string;
      argv: string[];
      options: Options;
    }
    export interface Options {
      /** Executable name */
      bin: string;
      /** Tasks file name */
      file: string;
      /** Project directory */
      directory: string;
      /** Allow running multiple tasks */
      multitask: boolean;
    }
  }
}
