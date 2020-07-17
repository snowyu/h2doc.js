/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable @typescript-eslint/naming-convention */

import { defaultsDeep, get, uniq as unique } from 'lodash';
import os from 'os';
import path from 'path';
import loadConfig from './load-config';
import { replaceEnv } from './replace-env';

export const mdConfig = new loadConfig({
  file: ['.md-config', 'md-config'],
  raiseError: false,
});

export interface ApplicationConfig {
  output: IOutputConfig;
  /**
   * slug options, if it is string which means separator
   */
  slug?: ISlugOptions | string;
  format?: IFormatConfig;
  download?: boolean | IDownloadConfig;
  frontMatter?: boolean | IFrontMatterConfig;
  mimetype?: IMimeTypeConfig;
  log?: any;
  imgCallback?: (imgNode: HTMLImageElement) => void;
}

export interface IOutputConfig {
  root: string;
  markdown: string;
  asset: string;
  assetBaseName: string;
}
export interface ISlugOptions {
  custom?: string[] | { [key: string]: string };
  lang?: string;
  maintainCase?: boolean;
  replacement?: string;
  separator?: string;
  separateNumbers?: boolean;
  tone?: boolean;
}

export interface IFormatConfig {
  headingStyle?: 'setext' | 'atx';
  hr?: string;
  br?: string;
  bulletListMarker?: '-' | '+' | '*';
  codeBlockStyle?: 'indented' | 'fenced';
  emDelimiter?: '_' | '*';
  fence?: '```' | '~~~';
  strongDelimiter?: '__' | '**';
  linkStyle?: 'inlined' | 'referenced';
  linkReferenceStyle?: 'full' | 'collapsed' | 'shortcut';

  gfw?: boolean | IGfwFormatConfig;
}

export interface IGfwFormatConfig {
  strikethrough?: boolean;
  tables?: boolean;
  taskListItems?: boolean;
}

export interface IFrontMatterConfig {
  title?: boolean;
  author?: boolean;
  date?: boolean;
  category?: boolean;
  tags?: boolean;
  updated?: boolean;
  published?: boolean;
  publisher?: boolean;
  description?: boolean;
  lang?: boolean;
  video?: boolean;
  audio?: boolean;
  url?: boolean;
  logo?: boolean;
  image?: boolean;
  slug?: boolean;
  /**
   * whether extract the directory from the list in the specified heading.
   */
  toc?: boolean;
  headingsAsToc?: boolean | IFrontMatterHeadingAsTocConfig;
  heading?: string;
}
export type KeysOfFrontMatterConfig = keyof IFrontMatterConfig;
export const frontMatterCfgNames = [
  'title',
  'author',
  'date',
  'category',
  'tags',
  'updated',
  'published',
  'description',
  'lang',
  'video',
  'audio',
  'url',
  'logo',
  'image',
  'slug',
  'toc',
  'headingsAsToc',
  'heading',
];

export interface IFrontMatterHeadingAsTocConfig {
  /**
   * Use headings whose depth is at most max depth for generate. defaults to 3.
   */
  maxDepth?: number;
  /**
   * the first level to generate the directory from the headings of markdown. defaults to 1.
   */
  firstLevel?: number;
}

export interface IDownloadConfig {
  deep?: number;
  type?: string | string[];
  exclude?: string | string[];
}

export interface IMimeTypeConfig {
  [name: string]: string | string[];
}

let gConfig;
let gMimetype;

export function getDownloadMimetype(download?: boolean | IDownloadConfig) {
  if (!download) return;
  let result: string[];
  if (typeof download === 'object' && download.type) {
    if (typeof download.type === 'string') {
      result = [download.type];
    } else {
      result = download.type;
    }
  } else {
    result = ['media', 'document', 'archive'];
  }
  const mimetype = gMimetype || defaultMimetype;
  result = result.map(m => mimetype[m] || m);
  return result;
}

function initOutConfig(conf: ApplicationConfig) {
  let out = conf.output;
  if (!out) {
    out = conf.output = {
      root: '.',
      markdown: '',
      asset: '',
      assetBaseName: '',
    };
  }
  if (!out.root) out.root = '.';
  if (!out.markdown) out.markdown = '${folder}/${title}.md';
  if (!out.asset) out.asset = '${folder}/${title}';
  if (!out.assetBaseName) out.assetBaseName = '${imgName}';
  out.root = replaceEnv(out.root);
  return conf;
}

export async function getConfig(config: any = {}) {
  if (gConfig) {
    if (Object.keys(config).length) {
      config = defaultsDeep(config, gConfig);
      gConfig = config;
    } else {
      config = gConfig;
    }
  } else {
    const vConfigFiles = unique([
      // current working dir config
      process.cwd(),
      // user home dir config
      os.homedir(),
      // default config
      path.resolve(__dirname, '../../config/'),
    ]);
    const vConfigs = await Promise.all(
      vConfigFiles.map(conf => mdConfig.load(conf))
    );
    // const vConfigs = [] as any[];
    // for (const conf of vConfigFiles) {
    //   const r = await mdConfig.load(conf);
    //   if (r) vConfigs.push(r);
    // }
    config = defaultsDeep(config, ...vConfigs);
    gConfig = config;
  }
  gMimetype = config.mimetype = config.mimetype || defaultMimetype;
  return initOutConfig(config);
}

export const setConfig = getConfig;

export async function getConfigValue(name: string) {
  const conf = await getConfig();
  return get(conf, name);
}

export const defaultMimetype = {
  image: ['image/*'],
  video: ['video/*'],
  audio: ['audio/*'],
  media: [
    ['video/*'],
    ['audio/*'],
    'application/ogg',
    'application/x-shockwave-flash',
  ],
  document: [
    'text/*',
    'application/pdf',
    'application/epub+zip',
    'application/msword',
    'application/rtf',
    'application/vnd.ms-powerpoint',
    'application/vnd.visio',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats*',
    'application/vnd.oasis.opendocument*',
    'application/json',
    'application/ld+json',
    'application/xhtml+xml',
  ],
  archive: [
    'application/x-bzip',
    'application/x-bzip2',
    'application/gzip',
    'application/vnd.rar',
    'application/x-tar',
    'application/zip',
    'application/x-7z-compressed',
  ],
  font: ['font/*', 'application/vnd.ms-fontobject'],
};
