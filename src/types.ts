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

export interface IOptions {
  file?: string;
  directory?: string;
  env?: IOfType<string>;
  silent?: boolean;
  log?: TLogger;
}
