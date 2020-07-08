const {Hook, Config, Command} = require('@oclif/config')
const {CLIError, error, exit, warn} = require('@oclif/errors')
const Debug = require('@oclif/config/lib/debug').default
const debug = Debug();

const findCommand = Config.prototype.findCommand;
const runCommand = Config.prototype.runCommand;

async function runCommandEx( id, argv = []) {
  debug('runCommand %s %o', id, argv)
  let c = this.findCommand(id)
  if (!c) {
    c = this.findCommand('default')
    argv.unshift(id)
  }
  if (!c) {
    await this.runHook('command_not_found', {id})
    throw new CLIError(`command ${id} not found`)
  }
  const command = c.load()
  await this.runHook('prerun', {Command: command, argv})
  const result = await command.run(argv, this)
  await this.runHook('postrun', {Command: command, result: result, argv})
}


function findCommandEx( id, opts = {}) {
  console.log('TCL::: findCommandEx -> id', id, this);
  const must = opts.must;
  if (must) opts.must = false;
  let result = findCommand.apply(this, arguments );
  if (!result) {
    if (must) opts.must = true;
    result = findCommand.call(this, 'download', opts)
    if (result) result.prototype.realId = id;
  }
  console.log('TCL::: findCommandEx -> result', !!result);

  return result;
}

// Config.prototype.findCommand = findCommandEx;
Config.prototype.runCommand = runCommandEx;
