import { LogLevelDesc } from 'loglevel';

export interface IOfType<T> {
  [key: string]: T;
}

export type TLogger = LogLevelDesc;

export type TScript =
  | undefined
  | null
  | false
  | string
  | ((args: string[]) => Promise<TScript> | TScript)
  | IScriptsArray;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IScriptsArray extends Array<TScript> {}

export interface IScripts {
  [key: string]: TScript | TScript[] | IScripts;
}

export interface IOptions {
  env?: IOfType<string>;
  silent?: boolean;
  log?: TLogger;
}

export interface IScopeOptions extends IOptions {
  root?: string | null;
  children?: TChildrenDefinition;
}

export interface IBaseOptions extends IOptions {
  file?: string | null;
  directory?: string | null;
}

export type TCoreOptions = IBaseOptions & IScopeOptions;

export type TChildrenDefinition = IOfType<string> | string[];

export interface IExecOptions {
  cwd?: string;
  env?: IOfType<string>;
}
