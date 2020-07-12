import fg from 'fast-glob';
import fs from 'fs';
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
  // root = path.join(root, '**');
  if (!Array.isArray(exclude)) exclude = [exclude];
  // exclude = exclude.filter(Boolean).map(v => '!' + v);
  // exclude.unshift(path.join(root, '**'));
  const result = (
    await fg(path.join(root, '**'), {
      ignore: exclude,
      onlyDirectories: true,
      deep,
    })
  )
    .filter(
      p =>
        !(isFile(p + '.md') || isFile(p + '.markdown') || isFile(p + '.html'))
    )
    .sort();
  return result;
}

export async function getFolders() {
  const conf = await getConfig();
  const dirs = await listDirs(conf.output);
  return dirs;
}

export function isFile(filepath: string) {
  let result: boolean;
  try {
    result = fs.lstatSync(filepath).isFile();
  } catch (error) {
    result = false;
  }
  return result;
}

export function relativePaths(root: string, paths: string[]) {
  return paths.map(p => path.relative(root, p));
}
