import { TScript } from '~/types';
import core from '~/core';
import logger from '~/utils/logger';

export default function silent(script: TScript): TScript {
  return async function silent(args?: string[]): Promise<void> {
    try {
      await core.run(script, args || []);
    } catch (err) {
      logger.error(err);
    }
  };
}
