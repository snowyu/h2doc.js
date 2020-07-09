import { color } from '@oclif/color';
import { Command, flags } from '@oclif/command';
import { setConfig } from '../../lib/get-md-config';
import { createJoplinWebClipperServer } from '../../lib/joplin-web-clipper-srv';

export default class Server extends Command {
  static description = `The Joplin Web Clipper Server to save markdown and images
  `;
  static aliases = ['default', 'srv', 'svr'];

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
    // flag with no value (-f, --force)
    // force: flags.boolean({ char: 'f' }),
  };

  static args = [
    { name: 'dir', description: 'which folder to save ', default: '.' },
  ];

  async run() {
    this.log(
      color.blue('Joplin Web Clipper Server') +
        ' for ' +
        color.cyanBright('https://joplinapp.org/clipper/')
    );
    const { args, flags } = this.parse(Server);
    const { port, host } = flags;
    const { dir } = args;
    setConfig({ output: { root: dir } });
    this.log(`Web Clips will be stored on '${dir}' folder`);
    const svr = await createJoplinWebClipperServer(flags);
    await svr.start();
    this.log(`listening on ${svr.info.uri}`);
  }
}
