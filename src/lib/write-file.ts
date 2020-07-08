import fs from 'fs';
import { URL } from 'url';

export async function writeFile(
  filepath: string | number | Buffer | URL,
  data: any,
  options: fs.WriteFileOptions = { encoding: 'utf8' }
) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(filepath, data, options, function (err) {
      if (err) return reject(err);
      resolve();
    });
  }) as Promise<void>;
}
