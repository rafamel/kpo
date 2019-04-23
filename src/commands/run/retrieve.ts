import { IScripts, IOfType, TScript } from '~/types';
import { get } from 'slimconf';

export default function retrieveTask(
  name: string,
  kpo: IScripts | null,
  pkg: IOfType<any> | null
): TScript {
  let task: TScript;

  try {
    task = kpoRetrieveTask(name, kpo);
  } catch (err) {
    if (pkg && pkg.hasOwnProperty('scripts')) {
      task = pkg.scripts[name];
    }
    if (!task) throw err;
  }

  return task;
}

function kpoRetrieveTask(name: string, kpo: IScripts | null): TScript {
  if (!kpo) throw Error(`Task ${name} couldn't be found`);

  let task: TScript;

  try {
    let item = get(kpo, name, true);
    if (typeof item === 'object' && item !== null) {
      if (item.hasOwnProperty('default')) item = item.default;
    }
    task = item;
  } catch (_) {
    throw Error(`Task ${name} couldn't be found`);
  }

  return task;
}
