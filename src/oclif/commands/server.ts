import { color } from '@oclif/color';
import { Command, flags } from '@oclif/command';
import { createJoplinWebClipperServer } from '../../joplin-web-clipper-srv';
import { getConfig, setConfig } from '../../lib/get-md-config';

export default class Server extends Command {
  static description = `The Joplin Web Clipper Server to save markdown and images
  `;
  static aliases = ['default', 'srv', 'svr', 'serv'];

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    host: flags.string({
      char: 'h',
      description: 'the host to serve',
      default: 'localhost',
    }),
    port: flags.integer({
      char: 'p',
      description: 'the port to serve',
      default: 41184,
    }),
    timeout: flags.integer({
      char: 't',
      description: 'the timeout to serve',
      default: 15000,
    }),
    // flag with no value (-f, --force)
    // force: flags.boolean({ char: 'f' }),
  };

  static args = [{ name: 'dir', description: 'which folder to save' }];

  async run() {
    this.log(
      color.blue('Joplin Web Clipper Server') +
        ' for ' +
        color.cyanBright('https://joplinapp.org/clipper/')
    );
    const { args, flags }: any = this.parse(Server);
    // const { port, host } = flags;
    const { dir } = args;
    if (dir) await setConfig({ output: { root: dir } });
    const conf = await getConfig();
    this.log(`Web Clips will be stored on '${conf.output.root}' folder`);
    flags.log = conf.log;
    const svr = await createJoplinWebClipperServer(flags);
    await svr.start();
    // this.log(`listening on ${svr.info.uri}`);
  }
}
