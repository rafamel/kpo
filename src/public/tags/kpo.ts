import asTag from '~/utils/as-tag';
import expose, { TExposedOverload } from '~/utils/expose';
import toArgv from 'string-argv';
import { splitBy } from 'cli-belt';
import main from '~/bin/main';

export default expose(kpo) as TExposedOverload<
  typeof kpo,
  [string] | [TemplateStringsArray, ...any[]]
>;

function kpo(command: string): (args?: string[]) => Promise<void>;
function kpo(
  literals: TemplateStringsArray,
  ...placeholders: any[]
): (args?: string[]) => Promise<void>;
/**
 * String tag; runs `kpo` commands without spawning a new process.
 * It is an *exposed* function: use `kpo.fn` as tag instead in order to execute on call.
 * @returns An asynchronous function -hence, calling `kpo` won't have any effect until the returned function is called.
 */
function kpo(...args: any[]): (args?: string[]) => Promise<void> {
  return async function kpo(_argv) {
    const command = asTag(args.shift(), ...args);

    let argv = toArgv(command);
    const split = splitBy(argv);
    split[1] = split[1].concat(_argv || []);
    if (split[1].length) argv = split[0].concat('--').concat(split[1]);

    await main(argv);
  };
}
