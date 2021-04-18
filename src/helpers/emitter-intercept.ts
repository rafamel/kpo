import { Members, VariadicFn } from 'type-core';

export interface EmitterIntercept<T> {
  emitter: T;
  emit(event: string, ...args: any[]): void;
  clear(): void;
}

export function emitterIntercept<T extends NodeJS.EventEmitter>(
  emitter: NodeJS.EventEmitter
): EmitterIntercept<T> {
  let members: Members<VariadicFn[]> = {};

  const proxy = new Proxy(emitter, {
    get(target, key, receiver) {
      switch (key) {
        case 'on':
        case 'once':
        case 'addListener': {
          return function(
            this: any,
            event: string,
            listener: VariadicFn,
            ...args: any[]
          ): any {
            if (!members[event]) members[event] = [];
            members[event].push(listener);
            return Reflect.apply(target[key], this, [event, listener, ...args]);
          };
        }
        default: {
          return Reflect.get(target, key, receiver);
        }
      }
    }
  });

  return {
    emitter: proxy as T,
    emit(event: string, ...args: any[]): void {
      const arr = members[event];
      if (!arr) return;

      const current = emitter.listeners(event);
      const listeners = arr.filter((fn) => current.includes(fn));
      members[event] = listeners;

      for (const listener of listeners) {
        listener(event, ...args);
      }
    },
    clear(): void {
      for (const [event, arr] of Object.entries(members)) {
        for (const listener of arr) {
          emitter.removeListener(event, listener);
        }
      }
      members = {};
    }
  };
}
