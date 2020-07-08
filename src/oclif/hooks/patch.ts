import {CLIError, error, exit, warn} from '@oclif/errors'
import {Hook, Config, Command,} from '@oclif/config'
import Debug from '@oclif/config/lib/debug'

const debug = Debug();

const findCommand = Config.prototype.findCommand;
const runCommand = Config.prototype.runCommand;

async function runCommandEx(this: Config, id: string, argv: string[] = []) {
  debug('runCommand %s %o', id, argv)
  let c = this.findCommand(id)
  if (!c) {
    c = this.findCommand('download')
    if (c) argv.unshift(id)
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

function findCommandEx(this: Config, id: string, opts: {must?: boolean} = {}) {
  const must = opts.must;
  if (must) opts.must = false;
  let result = findCommand.apply(this, arguments as any);
  if (!result) {
    result = findCommand.call(this, 'index')
  }

  return result;
}

// Config.prototype.findCommand = findCommandEx as any;
Config.prototype.runCommand = runCommandEx as any;
