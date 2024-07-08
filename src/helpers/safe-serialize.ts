import { TypeGuard } from 'type-core';

import type { Serial } from '../types';

export function safeSerialize(value: any): string {
  if (TypeGuard.isUndefined(value) || TypeGuard.isString(value)) {
    return String(value);
  } else {
    return JSON.stringify(walk(value));
  }
}

function walk(value: any): Serial {
  if (
    TypeGuard.isNullish(value) ||
    TypeGuard.isBoolean(value) ||
    TypeGuard.isString(value) ||
    TypeGuard.isNumber(value)
  ) {
    return value;
  }

  if (
    TypeGuard.isArray(value) &&
    Object.getPrototypeOf(value) === Array.prototype
  ) {
    return value.map((item) => walk(item));
  }

  if (
    TypeGuard.isRecord(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  ) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, walk(item)])
    );
  }

  throw new Error(`Non serializable value: ${value}`);
}
