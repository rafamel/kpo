import { Task, Context } from '../../definitions';
import { addPrefix } from '../../helpers/prefix';
import util from 'util';

export function print(item: any, ...data: any[]): Task.Sync {
  return (ctx: Context): void => {
    const str = addPrefix(
      util.format(item, ...data) + '\n',
      null,
      'print',
      ctx
    );
    ctx.stdio[1].write(str);
  };
}
