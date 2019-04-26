export default asTag;

function asTag(str: string): string;
function asTag(literals: TemplateStringsArray, ...placeholders: any[]): string;
function asTag(...args: any[]): string {
  let literals = args.shift();
  if (!Array.isArray(literals)) literals = [literals || ''];

  let str = '';
  for (let i = 0; i < literals.length; i++) {
    str += literals[i] + (args[i] ? String(args[i]) : '');
  }
  return str;
}
