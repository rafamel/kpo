import { splitBy } from 'cli-belt';
import { fetch } from '../../utils';
import { Task, CLI } from '../../definitions';
import { series, raises, print, context, combine } from '../../tasks';

export async function run(params: CLI.Extension.Params): Promise<Task> {
  const [names, args] = params.options.multitask
    ? splitBy(params.argv, '--')
    : [params.argv.slice(0, 1), params.argv.slice(1)];

  if (!names.length) {
    return series(print(params.help), raises(Error(`A task is required`)));
  }

  const tasks = await fetch({
    chdir: true,
    file: params.options.file,
    directory: params.options.directory
  });

  return context({ args }, combine({ include: names }, tasks));
}
