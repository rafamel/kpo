import { Empty } from 'type-core';
import { Context, Task } from './tasks';

export declare namespace CLI {
  /** Global Options */
  interface Options {
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
    /**
     * Package update notifications
     */
    update?: boolean | Update;
  }

  /** Update */
  interface Update {
    /** Name of published package */
    name: string;
    /** Current version */
    version: string;
    /** Distribution tag to use to find the latest version */
    tag?: string;
    /** Include a -g argument in the install recommendation */
    global?: boolean;
  }

  /** Command Extensions */
  interface Extension {
    name: string;
    description: string;
    execute: Extension.Execute;
  }
  namespace Extension {
    type Execute = (
      params: Params,
      context: Context
    ) => Task | Empty | Promise<Task | Empty>;
    interface Params {
      help: string;
      argv: string[];
      options: Options;
    }
    interface Options {
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
