import { Task, Context } from '../../definitions';
import { addPrefix } from '../../helpers/prefix';
import util from 'util';

export function print(...data: any[]): Task.Sync {
  return (ctx: Context): void => {
    const str = addPrefix(
      data.length ? util.format(data[0], ...data.slice(1)) + '\n' : '\n',
      null,
      'print',
      ctx
    );
    ctx.stdio[1].write(str);
  };
}
