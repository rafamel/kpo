import { IOfType } from '~/types';

export class KpoError<S> extends Error {
  public static isKpoError = true;
  /**
   * An optional `source` -should reference the object that originated the `Errorish`.
   */
  public source: any;
  /**
   * A `data` object.
   */
  public data: IOfType<any>;
  public constructor(message?: string | null, source?: S, data?: IOfType<any>) {
    if (!message) {
      if (typeof source === 'object' && source !== null) {
        message = (source as any).message;
      }
      if (!message && typeof source === 'string') message = source;
      if (!message) message = 'An error occurred';
    }

    super(message);
    this.source = source;
    this.data = data || {};
  }
  /**
   * Custom error name
   */
  public get name(): string {
    return 'CustomError';
  }
  /**
   * References `source.root` if it's a `KpoError`; references `source` if it's an instance of `Error`; otherwise it references itself.
   */
  public get root(): Error {
    if (isKpoError(this.source)) return this.source.root;
    return this.source instanceof Error ? this.source : this;
  }
  /**
   * Sets the `data` field and returns itself.
   */
  public set<T extends KpoError<S>>(this: T, data: IOfType<any>): T {
    this.data = data;
    return this;
  }
  /**
   * Assigns `data` to the instance `data` object and returns itself.
   */
  public assign<T extends KpoError<S>>(this: T, data: IOfType<any>): T {
    Object.assign(this.data, data);
    return this;
  }
}

/**
 * An error that whose stacktrace will be logged by default.
 */
export class OpenError<T> extends KpoError<T> {
  public get name(): string {
    return 'OpenError';
  }
}

/**
 * An error that won't result in the process exiting with code 1,
 * and will be logged as a warning.
 */
export class SilentError<T> extends KpoError<T> {
  public get name(): string {
    return 'SilentError';
  }
}

/**
 * Returns an `OpenError` as long as `source` is not a `KpoError`.
 */
export function open(source?: any): KpoError<any> {
  return isKpoError(source) ? source : new OpenError(undefined, source);
}

/**
 * Returns a `KpoError` as long as `source` is not a `KpoError`.
 */
export function error(source?: any): KpoError<any> {
  return isKpoError(source) ? source : new KpoError(undefined, source);
}

export function isKpoError(err: any): err is KpoError<any> {
  // We're duck typing errors as there might be several instances running
  return Boolean(
    err && err instanceof Error && (err.constructor as any).isKpoError
  );
}

export function isOpenError(err: any): err is OpenError<any> {
  return isKpoError(err) && err.name === 'OpenError';
}

export function isSilentError(err: any): err is OpenError<any> {
  return isKpoError(err) && err.name === 'SilentError';
}
