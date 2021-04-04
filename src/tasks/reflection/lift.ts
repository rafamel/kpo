import { Task, Context } from '../../definitions';
import { parseToRecord } from '../../helpers/parse';
import { getAbsolutePath } from '../../helpers/paths';
import { styleString } from '../../helpers/style-string';
import { isCancelled } from '../../utils/is-cancelled';
import { run } from '../../utils/run';
import { constants } from '../../constants';
import { select } from '../transform/select';
import { write } from '../filesystem/write';
import { print } from '../stdio/print';
import { shallow } from 'merge-strategies';
import { Members, NullaryFn, TypeGuard } from 'type-core';
import { into } from 'pipettes';
import fs from 'fs-extra';

export interface LiftOptions {
  /**
   * Remove all non lifted scripts
   */
  purge?: boolean;
  /**
   * Lift mode of operation:
   * * `'default'`: produces an immediate write.
   * * `'confirm'`: prints the changes and waits for confirmation before a write.
   * * `'dry'`: prints the expected changes.
   * * `'audit'`: prints the expected changes and fails if there are pending changes.
   */
  mode?: 'default' | 'confirm' | 'dry' | 'audit';
  /**
   * Lift default tasks and subtasks by their own
   */
  defaults?: boolean;
  /**
   * Name of kpo's executable
   */
  bin?: string;
}

/**
 * Lifts all tasks on a `tasks` record to a package.json file,
 * which is expected to be available at the context's working directory.
 * The `tasks` argument can be a record itself, a string
 * with the path of the tasks record, or empty to fetch
 * it at the default path.
 * @returns Task
 */
export function lift(
  tasks: Task.Record | NullaryFn<Task.Record>,
  options?: LiftOptions
): Task.Async {
  return async (ctx: Context): Promise<void> => {
    const opts = shallow(
      { purge: false, mode: 'default', defaults: false, bin: constants.bin },
      options || undefined
    );

    const source = TypeGuard.isFunction(tasks) ? tasks() : tasks;
    const pkgPath = getAbsolutePath('package.json', ctx);
    const pkgExists = await fs.pathExists(pkgPath);
    if (!pkgExists) {
      throw Error(`Couldn't retrieve package.json on path: ${ctx.cwd}`);
    }
    const content = await fs.readFile(pkgPath);
    const pkg = JSON.parse(content.toString());
    const pkgScripts: Members<string> = pkg.scripts || {};

    const taskScripts = into(
      source,
      parseToRecord.bind(null, {
        include: null,
        exclude: null,
        roots: true,
        defaults: opts.defaults
      }),
      (record) => Object.keys(record),
      (keys) => {
        return keys.reduce(
          (acc: Members<string>, name) => ({
            ...acc,
            [name]: `${opts.bin} ${name} --`
          }),
          {}
        );
      }
    );

    pkg.scripts = opts.purge ? taskScripts : { ...pkg.scripts, ...taskScripts };

    const isDefault = !['confirm', 'dry', 'audit'].includes(opts.mode);
    const areChangesPending = evaluateChanges(pkgScripts, taskScripts, ctx, {
      purge: opts.purge,
      print: !isDefault
    });

    if (!areChangesPending || (await isCancelled(ctx))) return;

    if (isDefault) {
      return run(write(pkgPath, pkg, { exists: 'overwrite' }), ctx);
    }
    if (opts.mode === 'audit') {
      throw Error(`There are pending scripts changes`);
    }
    if (opts.mode === 'confirm') {
      return run(
        select(
          { message: 'Continue?', default: 'y' },
          {
            y: write(pkgPath, pkg, { exists: 'overwrite' }),
            n: null
          }
        ),
        ctx
      );
    }
  };
}

function evaluateChanges(
  pkgScripts: Members<string>,
  taskScripts: Members<string>,
  context: Context,
  options: { print: boolean; purge: boolean }
): boolean {
  const pkgScriptNames = Object.keys(pkgScripts);
  const taskScriptNames = Object.keys(taskScripts);

  const addScriptNames: string[] = [];
  const keepScriptNames: string[] = [];
  const replaceScriptNames: string[] = [];
  const removeScriptNames: string[] = [];

  for (const name of pkgScriptNames) {
    if (!taskScriptNames.includes(name)) {
      options.purge ? removeScriptNames.push(name) : keepScriptNames.push(name);
    } else {
      const pkgValue = pkgScripts[name];
      const taskValue = taskScripts[name];
      pkgValue === taskValue
        ? keepScriptNames.push(name)
        : replaceScriptNames.push(name);
    }
  }
  for (const name of taskScriptNames) {
    if (!pkgScriptNames.includes(name)) {
      addScriptNames.push(name);
    }
  }

  const strArr: string[] = [];
  const areChangesPending = Boolean(
    addScriptNames.length ||
      replaceScriptNames.length ||
      removeScriptNames.length
  );

  if (options.print) {
    if (areChangesPending) {
      if (addScriptNames.length) {
        strArr.push(
          styleString('Scripts to add', { bold: true, color: 'green' }),
          addScriptNames.join(', ') + '\n'
        );
      }
      if (replaceScriptNames.length) {
        strArr.push(
          styleString('Scripts to replace', { bold: true, color: 'yellow' }),
          replaceScriptNames.join(', ') + '\n'
        );
      }
      if (removeScriptNames.length) {
        strArr.push(
          styleString('Scripts to remove', { bold: true, color: 'red' }),
          removeScriptNames.join(', ') + '\n'
        );
      }
    } else {
      strArr.push(styleString('No pending scripts changes', { bold: true }));
    }

    into(context, print(strArr.join('\n')));
  }

  return areChangesPending;
}
