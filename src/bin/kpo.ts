#!/usr/bin/env node
import { formatMessage } from '../helpers/format-message';
import { run } from '../utils/run';
import { log } from '../tasks/stdio/log';
import main from './main';
import { NullaryFn } from 'type-core';
import { attach, options, resolver, add } from 'exits';

/* Run main */
main(process.argv.slice(2))
  .then((task) => {
    const cbs: NullaryFn[] = [];
    const cancellation = new Promise<void>((resolve) => cbs.push(resolve));
    const promise = run(task, { cancellation });

    attach();
    options({
      spawned: { signals: 'none', wait: 'none' },
      resolver(type, arg) {
        return type === 'signal' ? resolver('exit', 1) : resolver(type, arg);
      }
    });
    add(async () => {
      cbs.map((cb) => cb());
      await Promise.all([cancellation, promise]).catch(() => undefined);
    });

    return promise;
  })
  .catch(async (err) => {
    await run(log('error', formatMessage(err)));
    return process.exit(1);
  });
