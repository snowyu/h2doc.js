import os from 'os';
import { replaceEnv } from './replace-env';

describe('replace-env', () => {
  it('should replace home dir if first char is ~', async () => {
    const result = replaceEnv('~/list');
    expect(result).toEqual(os.homedir + '/list');
  });
  it('should replace home dir if $HOME', async () => {
    const result = replaceEnv('has$HOME/list');
    expect(result).toEqual('has' + os.homedir + '/list');
  });
  it('should not replace home dir if $HOMEA', async () => {
    const result = replaceEnv('has$HOMEA/list');
    expect(result).toEqual('has$HOMEA/list');
  });
  it('should replace home dir if ${HOME}', async () => {
    const result = replaceEnv('has${HOME}list');
    expect(result).toEqual('has' + os.homedir + 'list');
  });
  it('should replace multi envs', async () => {
    const result = replaceEnv('has${HOME}list$HOME/');
    expect(result).toEqual('has' + os.homedir + 'list' + os.homedir + '/');
  });
});
