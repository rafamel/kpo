declare module 'spawn-command' {
  import { ChildProcess, SpawnOptions } from 'child_process';

  export default function sc(
    command: string,
    options?: SpawnOptions
  ): ChildProcess;
}
