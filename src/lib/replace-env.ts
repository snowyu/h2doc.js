import os from 'os';

export function replaceEnv(s: string) {
  const regEx = '(?!\\\\)\\$([A-Z_]\\w*)(?!\\w+)'; // $HOME
  const regEx2 = '(?!\\\\)\\${([A-Z_]\\w*)}'; // ${HOME}
  s = s.trim().replace(/^~/g, os.homedir);
  s = s.replace(new RegExp(regEx + '|' + regEx2, 'ig'), function (_, v1, v2) {
    let result = process.env[v1 || v2];
    if (!result) result = _;
    return result;
  });
  return s;
}
