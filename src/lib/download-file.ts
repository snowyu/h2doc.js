import got from 'got';
import Listr from 'listr';
// import { runTasks } from './run-tasks';

export interface IDownloadTask<Ctx = any> extends Listr.ListrTask<Ctx> {
  url: string;
}

interface IDownloadCtx {
  result: { url: string; content: Buffer }[];
}

export async function downloadFile(
  aUrls: string[] | string,
  title = 'downloading',
  concurrent = 5
) {
  const tasks = genDownloadTasks(aUrls, title);
  const task = new Listr(tasks, { concurrent });
  return task.run();
  // return runTasks(tasks, concurrent);
}

export function genDownloadTasks(
  aUrls: string[] | string,
  title = 'downloading'
) {
  if (typeof aUrls === 'string') aUrls = [aUrls];
  const tasks: IDownloadTask<IDownloadCtx>[] = aUrls.map(url => ({
    url,
    title: `${title}: ${url}`,
    async task(ctx, _task) {
      const response = await got(url);
      const result = { url, content: response.rawBody };
      if (Array.isArray(ctx?.result)) ctx.result.push(result);
      return result;
    },
  }));
  return tasks;
}
