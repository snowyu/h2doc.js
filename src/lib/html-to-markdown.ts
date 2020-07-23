/* eslint-disable @typescript-eslint/no-explicit-any */
import Debug from 'debug';
import FileType from 'file-type';
import got, { Response } from 'got';
import yaml from 'js-yaml';
import slug from 'limax';
import {
  isNil,
  omitBy,
  pick,
  template,
  TemplateExecutor,
  findIndex,
} from 'lodash';
import mimetype from 'mime-type/with-db';
import mkdirp from 'mkdirp';
import pLimit from 'p-limit';
import path from 'path.js';
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
  getDownloadMimetype,
} from './get-md-config';
import { getMetadata } from './get-metadata';
import { getTags, saveTags } from './list-tags';
import { writeFile } from './write-file';
import { trimFilename } from './simple-slug';

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
  htmlType?: 'simplifiedPageHtml' | 'completePageHtml' | 'selectedHtml';
}

function toSlug(conf: ISlugOptions | undefined | string, value: string) {
  return slug(value, conf);
}

function getTemplateImports(conf: ApplicationConfig) {
  return {
    shortid: shortid.generate.bind(shortid),
    toSlug: toSlug.bind(null, conf.slug),
  };
}

export async function htmlToMarkdown(input: IInputOptions) {
  const conf: ApplicationConfig = await getConfig();
  const assets = new Set<string>();
  if (typeof input.tags === 'string') input.tags = [input.tags];
  if (input.tags) {
    const vTagFolder = input.tags[0];
    if (
      vTagFolder &&
      (vTagFolder[0] === '/' ||
        (vTagFolder[0] === '.' && vTagFolder[1] === '/'))
    ) {
      input.folder =
        vTagFolder[0] === '/'
          ? '.' + vTagFolder
          : path.join(input.folder, vTagFolder);
      input.tags.splice(0, 1);
    }
  }

  debug('save to folder', input.folder);

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
  const downloadMimetype = getDownloadMimetype(conf.download);
  if (downloadMimetype && downloadMimetype.length) {
    meta.mimetype = downloadMimetype;
    const savedAssets = await saveAssets({
      conf: conf.output!,
      input,
      urls: Array.from(assets),
      meta,
      imports,
    });
    meta.assets = savedAssets;
    debug('assets saved');
  }
  debug('markdown saving');
  await saveMarkdown(conf.output!, input, meta, imports);
  return { content, assets: Array.from(assets), metadata, conf, input };
}

async function saveAssets({
  conf,
  input,
  urls,
  meta,
  imports,
}: {
  conf: IOutputConfig;
  input: IInputOptions;
  urls: string[];
  meta: any;
  imports: any;
}) {
  const assetDir = trimFilename(
    path.resolve(conf.root, template(conf.asset, { imports })(meta))
  );
  debug('assets Dir', assetDir);
  await mkdirp(assetDir);
  const limit = pLimit(5);
  const templated = template(conf.assetBaseName, { imports });
  const assets = urls.map(asset => {
    const vUrl = url.resolve(input.url!, asset);
    const filename = path.basename(
      decodeURIComponent(path.basename(new url.URL(vUrl).pathname))
    );
    return {
      filename,
      url: vUrl,
      src: asset,
    };
  });
  assets.forEach((asset, ix, arr) => {
    if (
      findIndex(
        arr,
        (item, i) => i !== ix && item.filename === asset.filename
      ) >= 0
    ) {
      const extname = path.extname(asset.filename);
      asset.filename = path.replaceExt(asset.filename, ix + extname);
      if (
        findIndex(
          arr,
          (item, i) => i !== ix && item.filename === asset.filename
        ) >= 0
      ) {
        asset.filename = path.replaceExt(
          asset.filename,
          shortid.generate() + extname
        );
      }
    }
  });
  const tasks = assets.map((asset, index) =>
    limit(() => saveAsset(asset, index, conf, meta, assetDir, templated))
  );
  const result = (await Promise.all(tasks)).filter(Boolean);
  return result;
}

async function saveAsset(
  asset: { url: string; src: string; filename: string },
  index: number,
  conf: IOutputConfig,
  meta: any,
  assetDir: string,
  templated: TemplateExecutor
) {
  // const vUrl = new url.URL(asset.url);
  let assetBaseName = asset.filename; // path.basename(vUrl.pathname);
  let extname = path.extname(assetBaseName);
  assetBaseName = assetBaseName.slice(0, assetBaseName.length - extname.length);
  debug('asset get:', asset.url);
  let response: Response;
  let contentType: string | undefined;
  try {
    response = await got(asset.url);
    contentType = response.headers['content-type'];
  } catch (err) {
    debug('asset got err:', err.message, asset.url);
    return;
  }

  if (!contentType) {
    const vFiletype = await FileType.fromBuffer(response.rawBody);
    if (vFiletype) contentType = vFiletype.mime;
  }

  if (contentType) {
    const vMime = mimetype[contentType];
    if (vMime) {
      const vExts = (vMime as any).extensions as string[];
      vExts.forEach(v => {
        v = '.' + v + '.';
        const i = assetBaseName.indexOf(v);
        if (i !== -1) assetBaseName = assetBaseName.split(v).join('.');
      });
      if (vExts.length && vExts.indexOf(extname) === -1) {
        extname = '.' + getShortExtension(vExts);
      }
    }
  }

  // const contentType = response.headers['content-type']
  // response.rawBody
  meta.index = index;
  meta.assetBaseName = assetBaseName;
  meta.extname = extname;

  const basename = templated(meta);
  const filename = trimFilename(path.resolve(assetDir, basename + extname));
  debug('asset save:', path.relative(conf.root, filename));
  await writeFile(filename, response.rawBody, {
    encoding: 'binary',
  });
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
  const filename = trimFilename(
    path.resolve(root, template(conf.markdown, { imports })(meta))
  );
  const dirname = path.dirname(filename);
  debug('markdownDir', dirname);
  await mkdirp(dirname);
  let content = input.content!;
  if (meta.assets) {
    meta.assets.forEach((asset: IAsset) => {
      const relativeName = path.relative(dirname, asset.filename);
      const reg = new RegExp(escapeRegExp(asset.asset.src), 'g');
      content = content.replace(reg, `${relativeName}`);
    });
  }
  debug('save', filename);
  await writeFile(filename, content);
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
  const html = input.htmlType === 'completePageHtml' ? input.html : undefined;
  let meta = await getMetadata(input.url!, html);
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

function getShortExtension(exts: string[]) {
  let result = exts[0];
  for (const ext of exts) {
    if (ext.length <= 3) {
      result = ext;
      break;
    }
  }
  return result;
}
