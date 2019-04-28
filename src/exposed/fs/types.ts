/**
 * Options taken by *fs* functions.
 */
export interface IFsOptions {
  /**
   * If `true`, it will require user confirmation for removal. Defaults to `false`.
   */
  confirm?: boolean;
}

/**
 * Options taken by *fs* functions that perform file reads.
 */
export interface IFsReadOptions extends IFsOptions {
  /**
   * If `false`, it won't fail if a path doesn't exist or the user doesn't confirm. Defaults to `true`.
   */
  fail?: boolean;
}
