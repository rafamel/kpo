import runTask from './task';

export default async function run(
  tasks: string[],
  args: string[]
): Promise<void> {
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

  for (let path of tasks) {
    await runTask(path, args);
  }
}
