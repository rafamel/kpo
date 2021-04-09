import { Members, NullaryFn, TypeGuard } from 'type-core';
import { shallow } from 'merge-strategies';
import { into } from 'pipettes';
import fs from 'fs-extra';
import { Task, Context } from '../../definitions';
import { parseToRecord } from '../../helpers/parse';
import { getAbsolutePath } from '../../helpers/paths';
import { isCancelled } from '../../utils/is-cancelled';
import { style } from '../../utils/style';
import { run } from '../../utils/run';
import { constants } from '../../constants';
import { create } from '../creation/create';
import { write } from '../filesystem/write';
import { confirm } from '../stdio/confirm';
import { print } from '../stdio/print';

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
  return create(async (ctx) => {
    const opts = shallow(
      {
        purge: false,
        mode: 'default',
        defaults: false,
        bin: constants.cli.bin
      },
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
    const areChangesPending = await evaluateChanges(
      pkgScripts,
      taskScripts,
      ctx,
      { post: isDefault, purge: opts.purge }
    );

    if (!areChangesPending || (await isCancelled(ctx))) return;

    if (isDefault) {
      return write(pkgPath, pkg, { exists: 'overwrite' });
    }
    if (opts.mode === 'audit') {
      throw Error(`There are pending scripts changes`);
    }
    if (opts.mode === 'confirm') {
      return confirm(
        { default: true, message: 'Continue?' },
        write(pkgPath, pkg, { exists: 'overwrite' }),
        null
      );
    }
  });
}

async function evaluateChanges(
  pkgScripts: Members<string>,
  taskScripts: Members<string>,
  context: Context,
  options: { post: boolean; purge: boolean }
): Promise<boolean> {
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

  if (areChangesPending) {
    if (addScriptNames.length) {
      strArr.push(
        style(options.post ? 'Scripts added: ' : 'Scripts to add: ', {
          bold: true,
          color: 'blue'
        }) + addScriptNames.join(', ')
      );
    }
    if (replaceScriptNames.length) {
      strArr.push(
        style(options.post ? 'Scripts replaced: ' : 'Scripts to replace: ', {
          bold: true,
          color: 'yellow'
        }) + replaceScriptNames.join(', ')
      );
    }
    if (removeScriptNames.length) {
      strArr.push(
        style(options.post ? 'Scripts removed: ' : 'Scripts to remove: ', {
          bold: true,
          color: 'red'
        }) + removeScriptNames.join(', ')
      );
    }
  } else {
    strArr.push(style('No pending scripts changes', { bold: true }));
  }

  await run(print(strArr.join('\n')), context);

  return areChangesPending;
}
