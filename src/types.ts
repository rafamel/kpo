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
  | (() => Promise<TScript> | TScript)
  | IScriptsArray;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IScriptsArray extends Array<TScript> {}

export interface IScripts {
  [key: string]: TScript | TScript[] | IScripts;
}

export interface ICoreOptions {
  env?: IOfType<string>;
  silent?: boolean;
  log?: TLogger;
}

export interface IBaseOptions extends ICoreOptions {
  file?: string | null;
  directory?: string | null;
}

export interface IScopeOptions extends ICoreOptions {
  root?: string | null;
  children?: IOfType<string>;
}
