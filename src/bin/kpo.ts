#!/usr/bin/env node

import main from './main';
import logger from '~/utils/logger';
import { terminate, state } from 'exits';
import attach from './attach';
import { error, isOpenError } from '~/utils/errors';

// Attach exits hooks
attach();
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
