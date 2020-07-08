import { Command } from '@oclif/config';
import { Help } from '@oclif/plugin-help';
import { uText } from '../../lib/u-text';

export default class CustomHelp extends Help {
  showHelp(args: string[]) {
    console.log(uText('Html to Doc', 'green'));
    super.showHelp(args);
    // console.dir('This will be displayed in multi-command CLIs', args);
  }

  showCommandHelp(command: Command) {
    // console.log(uText('Html to Doc', 'green'));
    super.showCommandHelp(command);
    // console.log('This will be displayed in single-command CLIs');
  }
}
