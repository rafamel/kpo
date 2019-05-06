#!/usr/bin/env node

import main from './main';
import { ensure } from 'errorish';
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
  logger.error(err.message);
  if (err instanceof errors.OpenError) logger.debug(err);

  return terminate('exit', 1);
});
