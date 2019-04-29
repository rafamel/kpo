/**
 * Options taken by *fs* functions.
 */
export interface IFsOptions {
  /**
   * If `true`, it will require user confirmation for removal. Defaults to `false`.
   */
  confirm?: boolean;
  /**
   * If `false`, it won't fail if a path doesn't exist for a read, or if it already exists for a write. Defaults to `false`.
   */
  fail?: boolean;
}

/**
 * Options taken by *fs* read functions.
 */
export interface IFsWriteOptions extends IFsOptions {
  /**
   * Overwrites files if they already exist. Defaults to `true`.
   */
  overwrite?: boolean;
}
