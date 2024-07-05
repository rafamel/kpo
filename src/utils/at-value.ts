import type { Dictionary, Serial } from 'type-core';

import type { Task } from '../definitions';
import { safeSerialize } from '../helpers/safe-serialize';

/**
 * Takes a `tasks` record of `Task`s and returns a function
 * that will return the `Task` of the record that matches the
 * serialization of `value`; otherwise `null`.
 * Particularly useful for stdio tasks such as
 * confirm, prompt, and select.
 */
export function atValue(
  tasks: Dictionary<Task>
): (value: Serial.Type) => Task | null {
  return (value) => {
    const field = safeSerialize(value);
    return Object.hasOwnProperty.call(tasks, field) ? tasks[field] : null;
  };
}
