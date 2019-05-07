import { IOfType } from '~/types';

export class KpoError<A> extends Error {
  public static isKpoError = true;
  public source: any;
  public data: IOfType<any>;
  public constructor(message?: string, source?: A) {
    if (!message) {
      if (typeof source === 'object' && source !== null) {
        message = (source as any).message;
      }
      if (!message && typeof source === 'string') message = source;
      if (!message) message = 'An error occurred';
    }

    super(message);
    this.source = source;
    this.data = {};
  }
  public get name(): string {
    return 'CustomError';
  }
  public get root(): Error {
    if (isKpoError(this.source)) return this.source.root;
    return this.source instanceof Error ? this.source : this;
  }
  public set<T extends KpoError<A>>(this: T, data: IOfType<any>): T {
    this.data = data;
    return this;
  }
  public assign<T extends KpoError<A>>(this: T, data: IOfType<any>): T {
    Object.assign(this.data, data);
    return this;
  }
}

export class OpenError<T> extends KpoError<T> {
  public get name(): string {
    return 'OpenError';
  }
}

export function open(source?: any): KpoError<any> {
  return isKpoError(source) ? source : new OpenError(undefined, source);
}

export function error(source?: any): KpoError<any> {
  return isKpoError(source) ? source : new KpoError(undefined, source);
}

export function isKpoError(err: any): err is KpoError<any> {
  // We're duck typing errors as there might be several instances running
  return err && err instanceof Error && (err.constructor as any).isKpoError;
}

export function isOpenError(err: any): err is OpenError<any> {
  return isKpoError(err) && err.name === 'OpenError';
}
