import { splitBy } from 'cli-belt';

import { fetch } from '../../utils';
import type { CLI, Task } from '../../definitions';
import { combine, context, print, raises, series } from '../../tasks';

export async function run(params: CLI.Extension.Params): Promise<Task> {
  const [names, args] = params.options.multitask
    ? splitBy(params.argv, '--')
    : [params.argv.slice(0, 1), params.argv.slice(1)];

  if (!names.length) {
    return series(print(params.help), raises(new Error(`A task is required`)));
  }

  const tasks = await fetch({
    chdir: true,
    files: params.options.files,
    directory: params.options.directory,
    property: params.options.property
  });

  return context({ args }, combine({ include: names }, tasks));
}
