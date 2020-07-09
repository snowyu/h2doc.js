import { Command, flags } from '@oclif/command';

export default class Download extends Command {
  static description = 'download html from a url only';
  static hidden = true;

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    format: flags.string({
      char: 't',
      description: 'the converted format',
      options: ['markdown', 'html'],
      default: 'markdown',
    }),
    // flag with no value (-f, --force)
    force: flags.boolean({
      char: 'f',
      description: 'defaults to overwrite existing files',
      default: true,
      allowNo: true,
    }),
  };

  static args = [
    {
      name: 'url',
      description: 'the html url or file to be processed',
      required: true,
    },
  ];

  async run() {
    const { args, flags } = this.parse(Download);
    console.log('TCL::: Download -> run -> argv', (this as any).argv);

    // const name = flags.url ?? 'world'
    const format = flags.format;
    this.log(
      `hello ${args.url}, ${format} from /home/riceball/mywork/h2doc-oclif/src/commands/download.ts`
    );
    if (args.url && flags.force) {
      this.log(`you input --force and url: ${args.url}`);
    }
  }
}
