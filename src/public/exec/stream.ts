import core from '~/core';
import expose from '~/utils/expose';
import { IChild } from '~/core/types';
import parallel from './parallel';
import series from './series';
import join from 'command-join';
import { NODE_PATH, KPO_PATH } from '~/constants';
import { IMultiExecOptions } from '~/types';
import chalk from 'chalk';
import { oneLine } from 'common-tags';
import errors from '~/utils/errors';

/**
 * Options taken by `stream`
 */
export type TStreamOptions = IMultiExecOptions & {
  /**
   * Include children by name
   */
  include?: string[];
  /**
   * Exclude children by name
   */
  exclude?: string[];
  /**
   * Execute streaming in parallel
   */
  parallel?: boolean;
  /**
   * Cwd is forbidden on `TStreamOptions`
   */
  cwd?: null;
};

export default expose(stream);

/**
 * Streams *kpo* commands for children projects.
 * It is an *exposed* function: call `stream.fn()`, which takes the same arguments, in order to execute on call.
 * @returns An asynchronous function taking additional arguments to be used for all commands -hence, calling `stream` won't have any effect until the returned function is called.
 */
function stream(
  argv: string[],
  options: TStreamOptions = {}
): (args?: string[]) => Promise<void> {
  return async (args: string[] = []) => {
    args = options.args || args;

    let children = await core.children();
    if (!children.length) throw Error(`Project has no children`);

    if (options.include) {
      children = options.include.map((name) => getChild(name, children));
    }

    if (options.exclude && options.exclude.length) {
      const excludeDirs = (options.exclude || []).map(
        (name) => getChild(name, children).directory
      );
      children = children.filter(
        (child) => !excludeDirs.includes(child.directory)
      );
    }

    if (!children.length) throw Error(`No project children selected`);

    const commands = children.map((child) => {
      return [NODE_PATH, KPO_PATH, '-d', child.directory]
        .concat(argv)
        .concat(args.length ? ['--'].concat(args) : []);
    });

    await (options.parallel
      ? parallel.fn(commands.map(join), {
          ...options,
          cwd: undefined,
          names: children.map((child) => '@' + child.name)
        })
      : series
          .fn(
            commands.reduce(
              (acc: string[], cmd, i) =>
                acc.concat([
                  join([
                    NODE_PATH,
                    '-e',
                    oneLine`console.log(
                    "${i === 0 ? 'Scope:' : '\\nScope:'}
                    ${chalk.bold.yellow('@' + children[i].name)}"
                  )`
                  ]),
                  join(cmd)
                ]),
              []
            ),
            { ...options, cwd: undefined }
          )
          .catch(async (err) => {
            throw new errors.WrappedError(
              'Series commands execution failed',
              null,
              err
            );
          }));
  };
}

/** @hidden */
function getChild(name: string, children: IChild[]): IChild {
  const matches = children.filter((child) => child.matcher(name));
  if (matches.length > 1) throw Error(`Several scopes matched name "${name}"`);
  if (matches.length < 1) throw Error(`Scope "${name}" not found`);
  return matches[0];
}
