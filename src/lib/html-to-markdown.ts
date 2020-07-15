/* eslint-disable @typescript-eslint/no-explicit-any */
import Debug from 'debug';
import got from 'got';
import yaml from 'js-yaml';
import slug from 'limax';
import { isNil, omitBy, pick, template, TemplateExecutor } from 'lodash';
import mkdirp from 'mkdirp';
import pLimit from 'p-limit';
import path from 'path';
import shortid from 'shortid';
import Turndown from 'turndown';
import { gfw, strikethrough, tables, taskListItems } from 'turndown-plugin-gfm';
import url from 'url';
import inject from 'util-ex/lib/inject';
import {
  ApplicationConfig,
  frontMatterCfgNames,
  getConfig,
  IFrontMatterConfig,
  IOutputConfig,
  ISlugOptions,
} from './get-md-config';
import { getMetadata } from './get-metadata';
import { getTags, saveTags } from './list-tags';
import { writeFile } from './write-file';
import { simpleSlug } from './simple-slug';

// import parseMarkdown from 'front-matter-markdown'

const debug = Debug('h2doc:markdown');
const GfwMaps = {
  strikethrough,
  tables,
  taskListItems,
  gfw,
};

export interface IInputOptions {
  html: string;
  title?: string;
  folder?: string;
  url?: string;
  tags?: string | string[];
  content?: string;
}

function toSlug(conf: ISlugOptions | undefined | string, value: string) {
  return slug(value, conf);
}

function getTemplateImports(conf: ApplicationConfig) {
  return { shortid, toSlug: toSlug.bind(null, conf.slug) };
}

export async function htmlToMarkdown(input: IInputOptions) {
  const conf: ApplicationConfig = await getConfig();
  const assets = new Set<string>();

  conf.imgCallback = (node: HTMLImageElement) => {
    const src = node?.getAttribute('src');
    if (src) assets.add(src);
  };

  const turndownService = initTurndownService(conf);
  let content = turndownService.turndown(input.html);
  let metadata!: any;
  if (conf.frontMatter && input.url) {
    metadata = await getMetadataEx(conf.frontMatter, input, conf.slug);
    const fm = yaml.safeDump(metadata);
    if (fm) {
      content = `---\n${fm}---\n\n` + content;
    }
  }
  if (metadata?.image) assets.add(metadata.image);
  if (metadata?.logo) assets.add(metadata.logo);
  if (metadata?.audio) assets.add(metadata.audio);
  if (metadata?.video) assets.add(metadata.video);
  const meta = Object.assign({}, metadata, input, conf);
  const imports = getTemplateImports(conf);
  input.content = content;
  if (conf.download) {
    const savedAssets = await saveAssets(
      conf.output!,
      input,
      Array.from(assets),
      meta,
      imports
    );
    meta.assets = savedAssets;
  }
  await saveMarkdown(conf.output!, input, meta, imports);
  return { content, assets: Array.from(assets), metadata, conf, input };
}

async function saveAssets(
  conf: IOutputConfig,
  input: IInputOptions,
  srcs: string[],
  meta: any,
  imports: any
) {
  const assetDir = simpleSlug(
    path.resolve(conf.root, template(conf.asset, { imports })(meta))
  );
  await mkdirp(assetDir);
  const limit = pLimit(5);
  const templated = template(conf.assetBaseName, { imports });
  const assets = srcs.map(asset => ({
    url: url.resolve(input.url!, asset),
    src: asset,
  }));
  const tasks = assets.map((asset, index) =>
    limit(() => saveAsset(asset, index, conf, meta, assetDir, templated))
  );
  const result = await Promise.all(tasks);
  return result;
}

async function saveAsset(
  asset: { url: string; src: string },
  index: number,
  conf: IOutputConfig,
  meta: any,
  assetDir: string,
  templated: TemplateExecutor
) {
  const vUrl = new url.URL(asset.url);
  let assetBaseName = path.basename(vUrl.pathname);
  const extname = path.extname(assetBaseName);
  assetBaseName = assetBaseName.slice(0, assetBaseName.length - extname.length);
  debug('get asset:', asset.url);
  const response = await got(asset.url);
  // const contentType = response.headers['content-type']
  // response.rawBody
  meta.index = index;
  meta.assetBaseName = assetBaseName;
  meta.extname = extname;

  const basename = templated(meta);
  const filename = simpleSlug(path.resolve(assetDir, basename + extname));
  debug('save asset to:', filename);
  await writeFile(filename, response.rawBody, { encoding: 'binary' });
  return { filename, asset, index };
}

interface IAsset {
  filename: string;
  asset: { url: string; src: string };
  index: number;
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

async function saveMarkdown(
  conf: IOutputConfig,
  input: IInputOptions,
  meta: any,
  imports: any
) {
  const root = conf.root;
  const filename = simpleSlug(
    path.resolve(root, template(conf.markdown, { imports })(meta))
  );
  const dirname = path.dirname(filename);
  await mkdirp(dirname);
  let content = input.content!;
  if (meta.assets) {
    meta.assets.forEach((asset: IAsset) => {
      const relativeName = path.relative(dirname, asset.filename);
      const reg = new RegExp(escapeRegExp(asset.asset.src), 'g');
      content = content.replace(reg, `${relativeName}`);
    });
  }
  await writeFile(filename, content, 'utf8');
  if (input.tags?.length) {
    const tags = await getTags();
    tags.push(...input.tags);
    await saveTags(tags, root);
  }
}

async function getMetadataEx(
  conf: boolean | IFrontMatterConfig,
  input: IInputOptions,
  slugConf?: ISlugOptions | string
) {
  let meta = await getMetadata(input.url!, input.html);
  const isBool = typeof conf === 'boolean';
  const fmCfgNames = isBool ? frontMatterCfgNames : Object.keys(conf);
  if (
    (conf as IFrontMatterConfig).date !== false &&
    fmCfgNames.indexOf('date') === -1
  )
    fmCfgNames.push('date');
  meta = pick(meta, fmCfgNames);
  if ((isBool || (conf as IFrontMatterConfig).title) && input.title) {
    meta.title = input.title;
  }

  if (input.title && (isBool || (conf as IFrontMatterConfig).slug)) {
    meta.slug = toSlug(slugConf, input.title);
  }
  if (
    (conf as IFrontMatterConfig).tags !== false &&
    input.tags &&
    input.tags.length
  )
    meta.tags = input.tags;

  if (!meta.date) meta.date = new Date().toISOString();
  meta = omitBy(meta, isNil);
  return meta;
}

function initTurndownService(conf: ApplicationConfig) {
  const turndownService = new Turndown(conf.format);
  const hasGfw = conf.format?.gfw;
  if (hasGfw) {
    if (typeof hasGfw !== 'boolean') {
      turndownService.use(
        Object.keys(hasGfw)
          .filter(Boolean)
          .map(n => GfwMaps[n])
      );
    } else {
      turndownService.use(gfw);
    }
  }
  let imgRule!: Turndown.Rule;
  for (const rule of turndownService.rules.array) {
    if (rule.filter === 'img') {
      imgRule = rule;
      break;
    }
  }
  if (imgRule && typeof conf.imgCallback === 'function') {
    const replacement = imgRule.replacement;
    if (replacement) {
      function beforeReplacement(content, node) {
        conf.imgCallback!(node);
      }
      imgRule.replacement = inject(replacement, beforeReplacement);
    }
  }
  return turndownService;
}
