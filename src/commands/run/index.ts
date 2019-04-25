import runTask from './task';
import core from '~/core';

export default async function run(tasks: string[]): Promise<void> {
  if (!tasks || !tasks.length) throw Error(`No tasks to run`);
  if (tasks.find((x) => x[0] === ':')) {
    throw Error(
      `Using : at the beggining of task names is forbidden -reserved for kpo commands`
    );
  }
  if (tasks.find((x) => x[0] === '@')) {
    throw Error(
      `Using @ at the beginning of task names is forbidden -reserved for kpo scopes`
    );
  }

  const { kpo, pkg } = await core.load();

  for (let name of tasks) {
    await runTask(name, kpo, pkg);
  }
}
