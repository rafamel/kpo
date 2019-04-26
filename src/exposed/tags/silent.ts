import { TScript } from '~/types';
import core from '~/core';

export default silent;

function silent(command: string): TScript;
function silent(strs: TemplateStringsArray, ...args: any[]): TScript;
function silent(strs: any, ...args: any[]): TScript {
  return async function silent(argv): Promise<void> {
    if (!Array.isArray(strs)) strs = [strs || ''];
    let command = '';
    for (let i = 0; i < strs.length; i++) {
      command += strs[i] + (args[i] ? String(args[i]) : '');
    }
    return core.exec(command, argv, false);
  };
}
