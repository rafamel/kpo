import { TScript } from '~/types';
import core from '~/core';
import logger from '~/utils/logger';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function silent(script: TScript) {
  return async function silent(args?: string[]): Promise<void> {
    try {
      await core.run(script, args || []);
    } catch (err) {
      logger.error(err);
    }
  };
}
