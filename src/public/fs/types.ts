import { IOfType } from '~/types';

export type TSource =
  | string
  | string[]
  | Promise<string[]>
  | (() => string[] | Promise<string[]>);

export type TDestination = string | { from?: string; to: string };

export type TCopyFilterFn =
  | ((src: string, dest: string) => boolean)
  | ((src: string, dest: string) => Promise<boolean>);

export type TContentFn = (data: {
  file: string;
  raw?: string;
}) => string | void | Promise<string | void>;

export type TJsonFn = (data: {
  file: string;
  raw?: string;
  json?: IOfType<any>;
}) => IOfType<any> | void | Promise<IOfType<any> | void>;

/**
 * Options taken by read *fs* functions.
 */
export interface IFsReadOptions {
  /**
   * Whether to enable logging. Default: `true`.
   */
  logger?: boolean;
  /**
   * If `false`, it won't fail if a path doesn't exist for a read, or if it already exists for a write. Default: `false`.
   */
  fail?: boolean;
}

/**
 * Options taken by *fs* functions.
 */
export interface IFsCreateDeleteOptions extends IFsReadOptions {
  /**
   * If `true`, it will require user confirmation for removal. Default: `false`.
   */
  confirm?: boolean;
}

/**
 * Options taken by *fs* write functions.
 */
export interface IFsUpdateOptions extends IFsCreateDeleteOptions {
  /**
   * Overwrites files if they already exist. Default: `true`.
   */
  overwrite?: boolean;
}
