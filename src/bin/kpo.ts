#!/usr/bin/env node

import main from './main';
import state from '~/state';
import { error } from 'cli-belt';
import logger from '~/utils/logger';
import { OpenError } from '~/utils/open';

main(process.argv.slice(2)).catch((err) => {
  const isOpen = err instanceof OpenError;

  return error(isOpen ? err.root : err, {
    exit: state.get('silent') ? 0 : 1,
    debug: true,
    logger: {
      error: logger.error,
      debug: isOpen ? logger.error : logger.debug
    }
  });
});
