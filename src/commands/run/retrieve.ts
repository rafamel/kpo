import { IScripts, IOfType, TScript } from '~/types';
import { get } from 'slimconf';
import { Errorish } from 'errorish';

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
  if (!kpo) return null;

  let task: TScript;

  try {
    task = get(kpo, name, true);
  } catch (err) {
    throw new Errorish(`Task ${name} couldn't be found`, null, err);
  }

  return task;
}
