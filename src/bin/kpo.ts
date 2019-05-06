#!/usr/bin/env node

import main from './main';
import logger from '~/utils/logger';
import { terminate, state } from 'exits';
import attach from './attach';
import { OWNED_ENV_KEY } from '~/constants';
import { error, isOpenError } from '~/utils/errors';

// Attach exits hooks
attach();
// Mark process as kpo owned, allowing for globals and env variables
// to be set to communicate between instances
process.env[OWNED_ENV_KEY] = 'true';
// Run main
main(process.argv.slice(2)).catch(async (err) => {
  if (state().triggered) return;

  err = error(err);
  logger.error(err.message);
  if (err.root.stack) {
    if (isOpenError(err)) logger.error(err.root.stack);
    else logger.trace(err.root.stack);
  }

  return terminate('exit', 1);
});
