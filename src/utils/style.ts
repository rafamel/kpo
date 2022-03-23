/* eslint-disable unicorn/import-style */
import chalk, { ForegroundColor, ChalkInstance } from 'chalk';
import { into } from 'pipettes';

export interface StyleOptions {
  color?: StyleColor;
  bg?: StyleColor;
  dim?: boolean;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
}

export type StyleColor = ForegroundColor;

/** Styles a string */
export function style(str: string, options?: StyleOptions): string {
  const opts = options || {};

  return into(
    chalk,
    (chalk) => (opts.color ? chalk[opts.color] : chalk),
    (chalk): ChalkInstance => {
      return opts.bg
        ? (chalk as any)['bg' + opts.bg[0].toUpperCase() + opts.bg.slice(1)]
        : chalk;
    },
    (chalk) => (opts.dim ? chalk.dim : chalk),
    (chalk) => (opts.bold ? chalk.bold : chalk),
    (chalk) => (opts.italic ? chalk.italic : chalk),
    (chalk) => (opts.underline ? chalk.underline : chalk),
    (chalk) => (opts.strikethrough ? chalk.strikethrough : chalk),
    (chalk) => chalk(str)
  );
}
