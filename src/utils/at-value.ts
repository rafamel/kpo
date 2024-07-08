import type { Callable, Dictionary, Serial } from '../types';
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
): Callable<Serial, Task | null> {
  return (value) => {
    const field = safeSerialize(value);
    return Object.hasOwnProperty.call(tasks, field) ? tasks[field] : null;
  };
}
