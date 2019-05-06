import { globals } from '~/globals';
import { IOfType } from '~/types';
import logger from './logger';

const processes: IOfType<Promise<void>> = globals('processses', {}).get();

function remove(pid: number): void {
  try {
    delete processes[pid];
  } catch (_) {
    logger.error(`Removal of child process ${pid} failed`);
  }
}

export default {
  add(pid: number, promise: Promise<void>): void {
    processes[pid] = promise.then(() => remove(pid)).catch(() => remove(pid));
  },
  kill(signal: string): void {
    Object.keys(processes)
      .map(Number)
      .forEach((pid) => process.kill(pid, signal));
  },
  isDone(): boolean {
    return !Object.keys(processes).length;
  },
  async promise(): Promise<void> {
    await Promise.all(Object.values(processes));
  }
};
