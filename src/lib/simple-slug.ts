import path from 'path.js';
/**
 * get friend string for filename
 * @param s the string to process
 * @return the processed string
 * @example
 *  trimDots('hi test...md.') to 'hi-test.md'
 */
export function simpleSlug(s: string) {
  if (s) {
    s = trim(s);
    s = s.replace(/[ ?:%!！：·\\–？=,'"+_]/g, '-');
    s = s.replace(/([.\-])[.\-]+/g, '$1');
    s = s.replace(/(^[\-]+)|[.\-]+$/g, '');
  }
  return s;
}

export function trim(s) {
  s = s.replace(/(^[ \-]+)|[ .\-]+$/g, '');
  return s;
}

export function trimFilename(s: string) {
  s = trim(s);
  const dirname = path.dirname(s)
  s = path.basename(s)
  const basename = simpleSlug(path.replaceExt(s, ''));
  const extname = simpleSlug(path.extname(s));
  return path.join(dirname, basename + extname);
}
