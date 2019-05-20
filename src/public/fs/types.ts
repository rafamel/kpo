export type TSource =
  | string
  | string[]
  | Promise<string[]>
  | (() => string[] | Promise<string[]>);

export type TCopyFilterFn =
  | ((src: string, dest: string) => boolean)
  | ((src: string, dest: string) => Promise<boolean>);

export type TContentFn = (
  file: string,
  raw?: string
) => string | void | Promise<string | void>;

/**
 * Options taken by read *fs* functions.
 */
export interface IFsReadOptions {
  /**
   * If `false`, it won't fail if a path doesn't exist for a read, or if it already exists for a write. Defaults to `false`.
   */
  fail?: boolean;
}

/**
 * Options taken by *fs* functions.
 */
export interface IFsCreateDeleteOptions extends IFsReadOptions {
  /**
   * If `true`, it will require user confirmation for removal. Defaults to `false`.
   */
  confirm?: boolean;
}

/**
 * Options taken by *fs* write functions.
 */
export interface IFsUpdateOptions extends IFsCreateDeleteOptions {
  /**
   * Overwrites files if they already exist. Defaults to `true`.
   */
  overwrite?: boolean;
}
