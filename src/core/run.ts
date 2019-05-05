import logger from '~/utils/logger';
import { TScript } from '~/types';
import errors from '~/utils/errors';
import guardian from '~/utils/guardian';

export default async function run(
  script: TScript,
  runner: (
    item:
      | string
      | ((args: string[]) => Promise<TScript | void> | TScript | void)
  ) => Promise<any>
): Promise<void> {
  guardian();

  if (!script) {
    logger.debug('Empty task');
  } else if (script instanceof Error) {
    throw script;
  } else if (typeof script === 'string') {
    logger.debug('Command exec: ' + script);
    await runner(script);
  } else if (typeof script === 'function') {
    logger.debug('Run function' + (script.name ? ` ${script.name}` : ''));
    let res: TScript;
    try {
      res = await runner(script);
    } catch (err) {
      throw errors.open.ensure(err);
    }
    await run(res, runner);
  } else if (Array.isArray(script)) {
    for (let sub of script) {
      await run(sub, runner);
    }
  } else {
    throw Error(`Task wasn't a TScript`);
  }
}
