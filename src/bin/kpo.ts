#!/usr/bin/env node

import main from './main';
import logger from '~/utils/logger';
import { terminate, state } from 'exits';
import attach from './attach';
import { error, isOpenError, isSilentError } from '~/utils/errors';

// Attach exits hooks
attach();
// Run main
main(process.argv.slice(2)).catch(async (err) => {
  if (state().triggered) return;

  if (isSilentError(err)) {
    logger.debug('Silent: exiting with code 0');
    logger.warn(err.message);
    if (err.root.stack) logger.trace(err.root.stack);
    return terminate('exit', 0);
  }

  err = error(err);
  if (isOpenError(err) && err.root.stack) {
    logger.error(err.message + '\n' + err.root.stack);
  } else {
    logger.error(err.message);
    if (err.root.stack) logger.trace(err.root.stack);
  }

  return terminate('exit', 1);
});
