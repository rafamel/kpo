import tree from 'ps-tree';
import { waitUntil, lazy } from 'promist';
import logger from './logger';

export default class PSManager {
  private children: Promise<number[]>;
  public constructor(pid: number) {
    this.children = lazy((resolve, reject) => {
      return tree(pid, (err, children) =>
        err
          ? reject(err)
          : resolve(children.map((child) => parseInt(child.PID)))
      );
    });
  }
  public async hasChildren(): Promise<boolean> {
    return this.children.then((children) => !!children.length);
  }
  public async killAll(signal: string, interval?: number): Promise<void> {
    const children = await this.children;
    logger.debug(
      `Seding ${signal} to all children processes: ${children.length}`
    );

    return waitUntil(() => {
      for (let pid of children) {
        try {
          process.kill(pid, 0);
          // if it doesn't error out, it's still pending
          return false;
        } catch (_) {}
      }
      return true;
    }, interval);
  }
}
