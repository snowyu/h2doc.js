import { dataUriToString } from './data-uri-to-string';

export interface MimeBuffer extends Buffer {
  type: string;
  typeFull: string;
  charset: string;
}

export function dataUriToBuffer(uri: string): MimeBuffer {
  const data = dataUriToString(uri);
  const { type, typeFull, charset, encoding } = data;
  const buffer = Buffer.from(data + '', encoding) as MimeBuffer;

  // set `.type` and `.typeFull` properties to MIME type
  buffer.type = type;
  buffer.typeFull = typeFull;

  // set the `.charset` property
  buffer.charset = charset;

  return buffer;
}
