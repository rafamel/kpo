#!/usr/bin/env node

import main from './main';
import state from '~/state';
import { error } from 'cli-belt';
import logger from '~/utils/logger';

main(process.argv.slice(2)).catch((err) => {
  return error(err, {
    exit: state.get('silent') ? 0 : 1,
    debug: true,
    logger
  });
});
