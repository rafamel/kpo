import argv from 'string-argv';

export default function trim(str: string): string {
  return argv(str)
    .map((x) => x.trim())
    .join(' ');
}
