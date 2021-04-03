import chalk, { ForegroundColor, Chalk } from 'chalk';
import { into } from 'pipettes';

export interface StyleStringOptions {
  color?: typeof ForegroundColor;
  bg?: typeof ForegroundColor;
  dim?: boolean;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
}

export function styleString(
  str: string,
  options: StyleStringOptions = {}
): string {
  return into(
    chalk,
    (chalk) => (options.color ? chalk[options.color] : chalk),
    (chalk): Chalk => {
      return options.bg
        ? (chalk as any)[
            'bg' + options.bg[0].toUpperCase() + options.bg.slice(1)
          ]
        : chalk;
    },
    (chalk) => (options.dim ? chalk.dim : chalk),
    (chalk) => (options.bold ? chalk.bold : chalk),
    (chalk) => (options.italic ? chalk.italic : chalk),
    (chalk) => (options.underline ? chalk.underline : chalk),
    (chalk) => (options.strikethrough ? chalk.strikethrough : chalk),
    (chalk) => chalk(str)
  );
}
