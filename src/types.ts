import { LogLevelDesc } from 'loglevel';

export interface IOfType<T> {
  [key: string]: T;
}

export type TLogger = LogLevelDesc;

export type TScript = string | (() => Promise<void> | void);

export interface IScripts {
  [key: string]: TScript | TScript[] | IScripts;
}
