/**
 * get friend string for filename
 * @param s the string to process
 * @return the processed string
 * @example
 *  trimDots('hi test...md.') to 'hi-test.md'
 */
export function simpleSlug(s: string) {
  s = s.replace(/[ ?:%!！：\\–？=+_]/g, '-');
  s = s.replace(/([.\-])[.\-]+/g, '$1');
  s = s.replace(/(^[.\-]+)|[.\-]+$/g, '');
  return s;
}
