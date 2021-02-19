import { Task, Context } from '../../definitions';
import { parseToRecord } from '../../helpers/parse';
import { getAbsolutePath } from '../../helpers/paths';
import { isCancelled } from '../../utils/is-cancelled';
import { run } from '../../utils/run';
import { select } from '../aggregate/select';
import { write } from '../filesystem/write';
import { print } from '../stdio/print';
import { Members } from 'type-core';
import { into } from 'pipettes';
import chalk from 'chalk';
import fs from 'fs-extra';

export interface LiftOptions {
  purge?: boolean;
  mode?: 'default' | 'confirm' | 'dry' | 'audit';
}

export function lift(tasks: Task.Record, options?: LiftOptions): Task.Async {
  return async (ctx: Context): Promise<void> => {
    const opts = Object.assign({ purge: false, mode: 'default' }, options);

    const pkgPath = getAbsolutePath('package.json', ctx);
    const pkgExists = await fs.pathExists(pkgPath);
    if (!pkgExists) {
      throw Error(`Couldn't retrieve package.json on path: ${ctx.cwd}`);
    }
    const content = await fs.readFile(pkgPath);
    const pkg = JSON.parse(content.toString());

    const pkgScripts: Members<string> = pkg.scripts || {};
    const taskScripts = into(
      tasks,
      parseToRecord.bind(null, { include: null, exclude: null }),
      (record) => Object.keys(record),
      (keys) => {
        return keys.reduce(
          (acc: Members<string>, name) => ({
            ...acc,
            [name]: `kpo ${name} --`
          }),
          {}
        );
      }
    );

    pkg.scripts = opts.purge ? taskScripts : { ...pkg.scripts, ...taskScripts };

    const isDefault = !['confirm', 'dry', 'audit'].includes(opts.mode);

    if (isDefault) {
      return run(write(pkgPath, pkg, { exists: 'overwrite' }), ctx);
    }

    if (await isCancelled(ctx)) return;
    printChanges(pkgScripts, taskScripts, ctx, {
      purge: opts.purge,
      audit: opts.mode === 'audit'
    });

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

function printChanges(
  pkgScripts: Members<string>,
  taskScripts: Members<string>,
  context: Context,
  options: { purge: boolean; audit: boolean }
): void {
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
        chalk.bold.green('Scripts to add'),
        addScriptNames.join(', ') + '\n'
      );
    }
    if (replaceScriptNames.length) {
      strArr.push(
        chalk.bold.yellow('Scripts to replace'),
        replaceScriptNames.join(', ') + '\n'
      );
    }
    if (removeScriptNames.length) {
      strArr.push(
        chalk.bold.red('Scripts to remove'),
        removeScriptNames.join(', ') + '\n'
      );
    }
  } else {
    strArr.push(chalk.bold('No pending scripts changes'));
  }

  into(context, print(strArr.join('\n')));

  if (options.audit && areChangesPending) {
    throw Error(`There are pending scripts changes`);
  }
}
