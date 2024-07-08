export type Callable<A = void, T = void> = (args: A) => T;
export type Promisable<T> = Promise<T> | T;
export type Dictionary<T> = Record<string, T>;
export type Serial =
  | boolean
  | number
  | string
  | null
  | undefined
  | Array<Serial>
  | { [key: string]: Serial };
