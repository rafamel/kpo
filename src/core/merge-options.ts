import {
  TCoreOptions,
  IScopeOptions,
  ICliOptions,
  TLogger,
  IOfType
} from '~/types';
import { DEFAULT_LOG_LEVEL, KPO_LOG_ENV } from '~/constants';
import EnvManager from '~/utils/env-manager';
import logger, { setLevel } from '~/utils/logger';

const initial: TCoreOptions = {
  file: null,
  directory: null,
  env: {},
  silent: false,
  log: DEFAULT_LOG_LEVEL
};

export default function mergeOptions(
  manager: EnvManager,
  cli: ICliOptions = {},
  scope: IScopeOptions = {}
): TCoreOptions {
  const options: TCoreOptions = {
    ...initial,
    log: (manager.get(KPO_LOG_ENV) as TLogger) || initial.log,
    ...scope,
    ...stripUndefined(cli),
    env: Object.assign({}, initial.env, scope.env, cli.env)
  };

  // ensure cli own properties are of cli
  options.file = cli.file || initial.file;
  options.directory = cli.directory || initial.directory;

  return options;
}

export function stripUndefined(obj: IOfType<any>): IOfType<any> {
  return Object.entries(obj).reduce((acc: IOfType<any>, [key, value]) => {
    if (value !== undefined) acc[key] = value;
    return acc;
  }, {});
}

export function setLogger(
  manager: EnvManager,
  options: TCoreOptions
): () => void {
  const initial = logger.getLevel();
  const level = (options.log ||
    manager.get(KPO_LOG_ENV) ||
    DEFAULT_LOG_LEVEL) as TLogger;

  setLevel(level);
  manager.set(KPO_LOG_ENV, level);

  return function restore() {
    setLevel(initial as any);
  };
}
