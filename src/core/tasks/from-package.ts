import { IOfType } from '~/types';
import { ITask } from '../types';

export default function getFromPackage(path: string, pkg: IOfType<any>): ITask {
  if (
    !Object.hasOwnProperty.call(pkg, 'scripts') ||
    !Object.hasOwnProperty.call(pkg.scripts, path)
  ) {
    throw Error(`Task ${path} not found`);
  }

  return {
    path,
    hidden: false,
    script: pkg.scripts[path]
  };
}
