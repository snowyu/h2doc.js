import fg from 'fast-glob';
import parseMarkdown from 'front-matter-markdown';
import yaml from 'js-yaml';
import mimetype from 'mime-type/with-db';
import path from 'path.js';
import { getConfig } from './get-md-config';
import loadConfig from './load-config';
import { readFile } from './read-file';
import { writeFile } from './write-file';

export const TagsFileName = '.md-tags.yaml';

export const tagsConfig = new loadConfig({
  file: [TagsFileName],
});

export async function saveTags(tags: string[], dir: string) {
  return saveTagsTo(tags, path.resolve(dir, TagsFileName));
}

export async function saveTagsTo(
  tags: string[],
  filepath: string = TagsFileName
) {
  tags = [...new Set(tags)];
  const mime = mimetype.lookup(filepath);
  let content;
  if (mime === 'application/json') {
    content = JSON.stringify(tags, undefined, 2);
  } else {
    content = yaml.safeDump(tags);
    filepath = path.replaceExt(filepath, '.yaml');
  }
  await writeFile(filepath, content);
}

export async function listTags(aPath: string) {
  const vPattern = ['markdown', 'md'].map(ext =>
    path.resolve(aPath, '**/*.' + ext)
  );
  const vPaths = await fg(vPattern, { onlyFiles: true, unique: true });
  const result: Set<string> = (await Promise.all(vPaths.map(p => readFile(p))))
    .map(content => parseMarkdown(content, { content: false }))
    .reduce(function (last, current: any) {
      const tag = current && (current.tag || current.tags);
      if (tag) {
        if (Array.isArray(tag)) {
          tag.forEach(t => last.add(t));
        } else {
          last.add(tag);
        }
      }
      return last;
    }, new Set());
  return [...result];
}

export interface ITagsOptions {
  skip?: boolean;
  write?: boolean;
}

export async function getTags(
  dir: string | undefined = undefined,
  { skip = false, write = true }: ITagsOptions = {}
) {
  let content!: string[];
  if (!dir) {
    const conf = await getConfig();
    dir = conf.output.root;
  }
  if (skip)
    try {
      content = await tagsConfig.load(dir);
      if (Array.isArray(content)) {
        content = [...new Set<string>(content)];
      } else {
        content = [];
      }
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  if (content === undefined) {
    content = await listTags(dir);
    if (write && content.length) {
      await saveTagsTo(content, path.join(dir, TagsFileName));
    }
  }
  return content;
}
