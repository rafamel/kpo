import { oneLine } from 'common-tags';

export default line;

function line(str: string): string;
function line(literals: TemplateStringsArray, ...placeholders: any[]): string;
/**
 * String tag; converts a multiple line, indented, string, into a single line string:
 * ```javascript
 *  line`kpo foo bar baz
 *    -- --foo bar --baz foobar`
 *  // 'kpo foo bar baz -- --foo bar --baz foobar'
 * ```
 * @returns a `string`
 */
function line(...args: any[]): string {
  return oneLine(args.shift(), ...args);
}
