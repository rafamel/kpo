export default function cache<T>(getId: () => string, fn: () => T): () => T {
  let id: null | string = null;
  let value: null | T = null;

  return function() {
    const key = getId();
    if (key === id) return value as T;

    id = key;
    return (value = fn());
  };
}
