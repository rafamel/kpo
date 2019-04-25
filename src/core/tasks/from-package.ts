import { IOfType } from '~/types';
import { ITask } from '../types';

export default function getFromPackage(path: string, pkg: IOfType<any>): ITask {
  if (!pkg.hasOwnProperty('scripts')) throw Error(`Task ${path} not found`);
  if (!pkg.scripts.hasOwnProperty(path)) throw Error(`Task ${path} not found`);

  return {
    path,
    hidden: false,
    script: pkg.scripts[path]
  };
}
