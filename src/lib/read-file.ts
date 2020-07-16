import fs from 'fs';

export async function readFile(
  filepath: string,
  options?:
    | BufferEncoding
    | {
        encoding: BufferEncoding;
        flag?: string;
      }
) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filepath, options, function (err, result) {
      if (err) return reject(err);
      resolve(result as string);
    });
  }) as Promise<string>;
}
