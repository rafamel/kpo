#!/usr/bin/env node

import main from './main';
import { ensure } from 'errorish';
import { error } from 'cli-belt';
import errors from '~/utils/errors';
import logger from '~/utils/logger';
import { terminate, state } from 'exits';
import attach from './attach';
import { OWNED_ENV_KEY } from '~/constants';

// Attach exits hooks
attach();
// Mark process as kpo owned, allowing for globals and env variables
// to be set to communicate between instances
process.env[OWNED_ENV_KEY] = 'true';
// Run main
main(process.argv.slice(2)).catch(async (err) => {
  if (state().triggered) return;

  err = ensure(err);
  const isOpen = err instanceof errors.OpenError;
  error(err, {
    debug: true,
    logger: {
      error: logger.error,
      debug: isOpen ? logger.error : logger.debug
    }
  });

  return terminate('exit', 1);
});
