import Listr from 'listr';

export async function runTasks(
  tasks: Listr.ListrTask[],
  concurrent: number | boolean = 5
) {
  const task = new Listr(tasks, { concurrent });
  return task.run();
  // const limit = pLimit(concurrency);
  // tasks = tasks.map(task => limit(() => task))
  // return Promise.all(tasks);
}
