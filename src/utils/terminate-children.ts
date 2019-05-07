import tree from 'ps-tree';
import { waitUntil } from 'promist';
import logger from './logger';

export default async function terminateChildren(
  pid: number,
  signal: string,
  interval?: number
): Promise<void> {
  const children: number[] = await new Promise((resolve, reject) => {
    return tree(pid, (err, children) =>
      err ? reject(err) : resolve(children.map((child) => parseInt(child.PID)))
    );
  });

  logger.debug(
    `Sending ${signal} to all children processes (${children.length})`
  );
  for (let pid of children) {
    try {
      process.kill(pid, signal);
    } catch (_) {}
  }

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
