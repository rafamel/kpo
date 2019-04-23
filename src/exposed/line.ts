import { oneLine } from 'common-tags';

export default line;

function line(str: string): string;
function line(literals: string[], ...placeholders: any[]): string;
function line(...args: any[]): string {
  // @ts-ignore
  return oneLine(...args);
}
