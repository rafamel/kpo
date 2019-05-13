import EnvManager from './env-manager';
import { KPO_EXIT_ENV } from '~/constants';

const manager = new EnvManager(process.env);
export default function guardian(): void {
  if (manager.get(KPO_EXIT_ENV)) throw Error(`Process is terminating`);
}
