import { color } from '@oclif/color';
import figlet from 'figlet';

export function uText(s: string, aColor = 'gray', font = '3D-ASCII') {
  return color[aColor](
    figlet.textSync(s, {
      font: font as any,
      horizontalLayout: 'default',
      verticalLayout: 'default',
    })
  );
}
