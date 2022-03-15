import { TypeGuard } from 'type-core';

import vendors from 'ci-info/vendors.json';
import { Context } from '../definitions';

const envs = vendors.map((vendor) => vendor.env);

/**
 * Returns `true` when a context's environment
 * variables indicate it's running in a CI.
 */
export function isCI(context: Context): boolean {
  if ('CI' in context.env || 'CONTINUOUS_INTEGRATION' in context.env) {
    return true;
  }

  for (const env of envs) {
    if (TypeGuard.isString(env)) {
      if (env in context.env) return true;
    } else if (TypeGuard.isArray(env)) {
      const present = env.filter((env) => env in context.env);
      if (present.length === env.length) return true;
    } else {
      const entries = Object.entries(env);
      const matches = entries.filter(
        ([key, value]) => context.env[key] === value
      );
      if (entries.length === matches.length) return true;
    }
  }

  return false;
}
