import { ITask } from '../types';
import { IScripts } from '~/types';
import purePath from './pure-path';
import { KpoError } from '~/utils/errors';

export default function getFromKpo(path: string, kpo: IScripts): ITask {
  const task = trunk(purePath(path).split('.'), kpo, null, '');
  return { ...task, path: purePath(task.path) };
}

export function trunk(
  arr: string[],
  current: any,
  parent: any,
  path: string
): ITask {
  if (!arr.length) {
    if (
      typeof current === 'object' &&
      !Array.isArray(current) &&
      current !== null &&
      !(current instanceof Error)
    ) {
      const task = trunk(['default'], current, parent, path);
      if (current.hasOwnProperty('_description')) {
        if (task.hasOwnProperty('description')) {
          throw Error(`There are several descriptions for ${purePath(path)}`);
        }
        return { ...task, description: current._description };
      }
      return task;
    }

    return {
      path,
      hidden: false,
      script: typeof current === 'function' ? current.bind(parent) : current
    };
  }

  const key = arr.shift() as string;
  if (key[0] === '_') {
    throw Error(
      `Fields starting with '_' are reserved for metadata: ` +
        purePath(path ? `${path}.${key}` : key)
    );
  }
  if (
    typeof current !== 'object' ||
    current === null ||
    current instanceof Error
  ) {
    throw Error(`${purePath(path)} is not an object`);
  }

  const keys = key[0] === '$' ? [key] : [key, `$${key}`];
  const props = keys.filter((key) => current.hasOwnProperty(key));
  if (props.length > 1) {
    throw Error(
      `There are several tasks matching ` +
        purePath(path ? `${path}.${key}` : key)
    );
  }
  if (!props.length) {
    throw new KpoError(
      `There are no tasks matching ${purePath(path ? `${path}.${key}` : key)}`
    ).set({ type: 'NotFound' });
  }
  const actualKey = props.shift() as string;
  const task = trunk(
    arr,
    current[actualKey],
    current,
    path ? `${path}.${actualKey}` : actualKey
  );
  return actualKey[0] === '$' ? { ...task, hidden: true } : task;
}
