// force import of transpiled prompts
import prompts from 'prompts/dist';

export interface IConfirmOptions {
  confirm?: boolean;
  fail?: boolean;
}

export default async function confirm(
  message: string,
  options: IConfirmOptions = {}
): Promise<boolean> {
  if (!options.confirm) return true;

  const response = await prompts({
    type: 'confirm',
    name: 'value',
    message: message,
    initial: true
  });

  if (!response.value) {
    if (options.fail) throw Error(`Cancelled by user`);
    return false;
  }
  return true;
}
