import { color } from '@oclif/color';
import { Command, flags } from '@oclif/command';
import { cli } from 'cli-ux';
import path from 'path';
import { getConfig, setConfig } from '../../lib/get-md-config';
import {
  listTags,
  saveTags,
  tagsConfig,
  TagsFileName
} from '../../lib/list-tags';

export default class Tags extends Command {
  static description =
    'collect all tags from the front-matter in the folder and save to file';

  static flags = {
    ...cli.table.flags(),
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    cache: flags.string({
      char: 'c',
      description: 'cache all the tags in the folder to the file',
      default: TagsFileName,
    }),
    format: flags.string({
      char: 't',
      description: 'the display tags format',
      options: ['yaml', 'json'],
      default: 'yaml',
    }),
    write: flags.boolean({
      char: 'w',
      description: 'write to the cache file',
      default: false,
      // allowNo: true,
    }),
    skip: flags.boolean({
      char: 's',
      description: 'skip the cache file',
      // default: false,
      // exclusive: ['write'],
      // allowNo: true,
    }),
  };

  static args = [
    {
      name: 'folder',
      description:
        'the folder to collect tags, defaults to the current directory',
    },
  ];

  async run() {
    const { args, flags } = this.parse(Tags);
    let dir: string = args.folder;
    if (dir) await setConfig({ output: { root: dir } });
    const conf = await getConfig();
    if (!dir) dir = conf.output.root;
    let content: string[] | undefined;
    if (!flags.skip) {
      cli.action.start(`load the cache from: "${dir}"`);
      try {
        content = await tagsConfig.load(dir);
        if (Array.isArray(content)) {
          content = [...new Set<string>(content)];
        }
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
      cli.action.stop(content ? 'done' : 'missing');
    }
    if (content === undefined) {
      cli.action.start('try to load from files');
      content = await listTags(dir);
      cli.action.stop();
      if (flags.write || (content.length && !flags.skip)) {
        cli.action.start('save tags to cache');
        await saveTags(content, path.join(dir, TagsFileName));
        cli.action.stop();
      }
    }
    let result = '';
    if (content && content.length) {
      result = content
        .map((t, i) => (i % 2 === 0 ? color.blue(t) : color.green(t)))
        .join(', ');
    } else {
      result = '"' + color.redBright('No any tag found') + '"';
    }
    this.log(color.underline('                                       '));
    this.log(color.bold('Tags: ') + result);
  }
}
