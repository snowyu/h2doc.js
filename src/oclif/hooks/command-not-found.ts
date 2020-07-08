import { Hook } from '@oclif/config';

const hook: Hook<'command_not_found'> = async function (options) {
  // console.log(`example command_not_found hook running before ${options.id}`);
};

export default hook;
