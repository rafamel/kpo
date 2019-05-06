export default function cache<T>(
  getId: (() => string | number) | void | null,
  fn: () => T
): () => T {
  let id: null | string | number = null;
  let value: null | T = null;

  return function() {
    const key = getId ? getId() : '_';
    if (key === id) return value as T;

    id = key;
    return (value = fn());
  };
}
