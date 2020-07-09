import { color } from '@oclif/color';
import { Command, flags } from '@oclif/command';
import figlet from 'figlet';
// import { CLIError, error } from '@oclif/errors';
import fs from 'fs';
import { setConfig } from '../../lib/get-md-config';

export default class Markdown extends Command {
  static strict = false;
  static hidden = true;
  static description =
    'process html url or file and convert to markdown format and save the images';

  static aliases = ['md'];
  static flags = {
    help: flags.help({ char: 'h' }),
    output: flags.string({
      char: 'o',
      description: 'the folder to output, defaults to current dir',
      default: '.',
    }),
    // flag with no value (-f, --force)
    // force: flags.boolean({
    //   char: 'f',
    //   description: 'defaults to overwrite existing files',
    //   default: true,
    //   allowNo: true,
    // }),
  };

  static args = [
    {
      name: 'url|file',
      description: 'the html url or file to be processed',
      required: true,
    },
    { name: 'second url|file' },
    { name: '...' },
  ];

  async run() {
    this.log(color.blue('The markdown feature has not been implemented yet'));
    this.log(
      figlet.textSync('To Be Continue', {
        font: 'Ghost',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      })
    );
    // this.exit();
    const { flags } = this.parse(Markdown);
    return;
    setConfig({ output: { root: flags.output } });
    const { urls, files } = await this.validateUrls(this.argv.filter(Boolean));

    // const tasks = genDownloadTasks(urls);
  }

  async validateUrls(aUrls: string[]) {
    const urls: string[] = [];
    const files: string[] = [];

    for (const url of aUrls) {
      if (isSupportedProtocol(url)) {
        urls.push(url);
      } else if (fs.existsSync(url)) {
        files.push(url);
      } else {
        this.log(
          `(markdown) ${color.red(
            'Error'
          )}: invalid url or file to process: '${color.yellow(url)}'`
        );
        await this.config.runHook('command_not_found', { id: url });
        // this.error('');
        // break;
        // const vErr = new CLIError(
        //
        // );
        // error(vErr);
      }
    }

    return { urls, files };
  }
}

function isValidUrl(url: string) {
  return isSupportedProtocol(url) || fs.existsSync(url);
}

function isSupportedProtocol(file: string) {
  var supportedProtocols = ['s3', 'ftp', 'http', 'https', 'scp', 'file'];
  var protocol = getProtocol(file);
  const result = supportedProtocols.indexOf(protocol) !== -1;
  return result;
}

function getProtocol(file: string) {
  var data = file.split('://');

  return data.length > 1 ? data[0] : '';
}
