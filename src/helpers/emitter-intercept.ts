import { Members, VariadicFn } from 'type-core';

export interface EmitterInterceptResponse<T> {
  emitter: T;
  emit(event: string, ...args: any[]): void;
}

export function emitterIntercept<T extends NodeJS.EventEmitter>(
  emitter: NodeJS.EventEmitter
): EmitterInterceptResponse<T> {
  const members: Members<VariadicFn[]> = {};

  const proxy = new Proxy(emitter, {
    get(target, key, receiver) {
      switch (key) {
        case 'on':
        case 'once':
        case 'addListener': {
          return function(this: any, ...args: any[]): any {
            if (!members[args[0]]) members[args[0]] = [];
            members[args[0]].push(args[1]);
            return Reflect.apply(target[key], this, args);
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
    }
  };
}
