import fs from 'fs';
// import shortid from 'shortid';
// import path from 'path.js';
import { URL } from 'url';

interface IWriteFileOptions {
  encoding?: string | null | undefined;
  mode?: string | number | undefined;
  flag?: string | undefined;
  // overwrite?: boolean;
  // index?: number;
}

export async function writeFile(
  filepath: string | number | Buffer | URL,
  data: any,
  options: IWriteFileOptions = { encoding: 'utf8' }
) {
  /* // no used for multi files saved simultaneously
  const overwrite = options?.overwrite !== false;
  if (!overwrite && typeof filepath === 'string') {
    if (fs.existsSync(filepath)) {
      const extname = path.extname(filepath);
      let ix = options.index;
      if (ix != null) {
        filepath = path.replaceExt(filepath, ix + extname) as string;
        if (fs.existsSync(filepath)) ix = undefined;
      }
      if (ix === undefined) {
        filepath = path.replaceExt(
          filepath,
          shortid.generate() + extname
        ) as string;
      }
    }
  }
  */
  return new Promise(function (resolve, reject) {
    fs.writeFile(filepath, data, options, function (err) {
      if (err) return reject(err);
      resolve(filepath as string);
    });
  }) as Promise<string>;
}
