import _confirm from '../../prompts/confirm';
import { IFsOptions } from '../types';

export default async function confirm(
  message: string,
  options: IFsOptions
): Promise<boolean> {
  if (options.confirm) {
    const action = await _confirm.fn(message, { no: false });

    if (action === false) {
      if (options.fail) throw Error(`Cancelled by user`);
      else return false;
    }
  }
  return true;
}
