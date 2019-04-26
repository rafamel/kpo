import { TScript } from '~/types';
import core from '~/core';
import asTag from '~/utils/as-tag';

export default silent;

function silent(command: string): TScript;
function silent(
  literals: TemplateStringsArray,
  ...placeholders: any[]
): TScript;
function silent(...args: any[]): TScript {
  return async function silent(argv): Promise<void> {
    const command = asTag(args.shift(), ...args);
    return core.exec(command, argv, false);
  };
}
