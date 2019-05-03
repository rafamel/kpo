import { ITask } from '../types';
import { IScripts } from '~/types';
import purePath from './pure-path';
import { CustomError } from '~/utils/errors';

export default function getFromKpo(path: string, kpo: IScripts): ITask {
  const task = trunk(purePath(path).split('.'), kpo, '');
  return { ...task, path: purePath(task.path) };
}

export function trunk(arr: string[], obj: any, path: string): ITask {
  if (!arr.length) {
    if (
      typeof obj === 'object' &&
      !Array.isArray(obj) &&
      obj !== null &&
      !(obj instanceof Error)
    ) {
      const task = trunk(['default'], obj, path);
      if (obj.hasOwnProperty('_description')) {
        if (task.hasOwnProperty('description')) {
          throw Error(`There are several descriptions for ${purePath(path)}`);
        }
        return { ...task, description: obj._description };
      }
      return task;
    }
    return { path, hidden: false, script: obj };
  }

  const key = arr.shift() as string;
  if (typeof obj !== 'object' || obj === null || obj instanceof Error) {
    throw Error(`${purePath(path)} is not an object`);
  }

  const keys = key[0] === '$' ? [key] : [key, `$${key}`];
  const props = keys.filter((key) => obj.hasOwnProperty(key));
  if (props.length > 1) {
    throw Error(
      `There are several tasks matching ` +
        purePath(path ? `${path}.${key}` : key)
    );
  }
  if (!props.length) {
    throw new CustomError(
      `There are no tasks matching ${purePath(path ? `${path}.${key}` : key)}`,
      { type: 'NotFound' }
    );
  }
  const actualKey = props.shift() as string;
  const task = trunk(
    arr,
    obj[actualKey],
    path ? `${path}.${actualKey}` : actualKey
  );
  return actualKey[0] === '$' ? { ...task, hidden: true } : task;
}
