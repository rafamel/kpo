import { IScripts, IOfType } from '~/types';
import getFromKpo from './from-kpo';
import getFromPackage from './from-package';
import { ITask, ITasks } from '../types';
import recursiveFields from './recursive-fields';

export function getTask(
  path: string,
  kpo?: IScripts,
  pkg?: IOfType<any>
): ITask {
  try {
    if (kpo) return getFromKpo(path, kpo);
    throw Error(`Task ${path} not found`);
  } catch (err) {
    if (!pkg) throw err;

    try {
      return getFromPackage(path, pkg);
    } catch (_) {
      throw err;
    }
  }
}

export function getAllTasks(kpo?: IScripts, pkg?: IOfType<any>): ITasks {
  const tasks: ITasks = {};

  let paths: string[] = [];
  if (kpo) {
    paths = recursiveFields(kpo);
    tasks.kpo = paths.map((path) => getFromKpo(path, kpo));
  }
  if (pkg) {
    tasks.pkg = pkg.hasOwnProperty('scripts')
      ? Object.keys(pkg.scripts).map((path) => getFromPackage(path, pkg))
      : [];
    // filter the ones existing in tasks kpo
    tasks.pkg = tasks.pkg.filter((task) => !paths.includes(task.path));
  }

  return tasks;
}
