import { state } from 'exits';

export default function guardian(): void {
  if (state().triggered) throw Error(`Process is terminating`);
}
