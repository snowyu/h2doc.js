import fg from 'fast-glob';
import path from 'path';
import { getConfig } from './get-md-config';

export async function listDirs({
  root,
  exclude = 'node_modules',
  deep = 5,
}: {
  root: string;
  exclude?: string | string[];
  deep?: number;
}) {
  root = path.join(root, '**');
  if (!Array.isArray(exclude)) exclude = [exclude];
  exclude = exclude.filter(Boolean).map(v => '!' + v);
  exclude.unshift(root);
  const result = (await fg(exclude, { onlyDirectories: true, deep })).sort();
  return result;
}

export async function getFolders() {
  const conf = await getConfig();
  const dirs = await listDirs(conf.output);
  return dirs;
}
