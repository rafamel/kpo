import core from '~/core';
import { IScopeOptions } from '~/types';
import { error } from '~/utils/errors';

// TODO remove
/**
 * Programmatically sets *kpo* options.
 */
export default async function options(opts: IScopeOptions): Promise<void> {
  try {
    await core.options.setScope(opts);
  } catch (err) {
    throw error(err);
  }
}
