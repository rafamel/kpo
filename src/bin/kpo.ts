#!/usr/bin/env node

import main from './main';
import core from '~/core';
import { error } from 'cli-belt';
import logger from '~/utils/logger';
import { OpenError } from '~/utils/errors';
import { ensure } from 'errorish';

main(process.argv.slice(2)).catch(async (err) => {
  err = ensure(err);
  const isOpen = err instanceof OpenError;

  return error(err, {
    exit: (await core.get('silent').catch(() => false)) ? 0 : 1,
    debug: true,
    logger: {
      error: logger.error,
      debug: isOpen ? logger.error : logger.debug
    }
  });
});
