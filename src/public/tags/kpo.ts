import asTag from '~/utils/as-tag';
import expose, { TExposedOverload } from '~/utils/expose';
import { NODE_PATH, KPO_PATH } from '~/constants';
import { commandJoin as join } from 'command-join';
import series from '../exec/series';

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
 * String tag; runs `kpo` commands.
 * It is an *exposed* function: use `kpo.fn` as tag instead in order to execute on call.
 * @returns An asynchronous function -hence, calling `kpo` won't have any effect until the returned function is called.
 */
function kpo(...args: any[]): (args?: string[]) => Promise<void> {
  const command = asTag(args.shift(), ...args);
  return series(join([NODE_PATH, KPO_PATH]) + ' ' + command);
}
