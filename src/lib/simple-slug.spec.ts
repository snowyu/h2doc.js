import { simpleSlug, trimFilename } from './simple-slug';

describe('simpleSlug', () => {
  it('should filter multi whitespace or dot...', () => {
    let result = simpleSlug('  test --–-- ..  it....?md.');
    expect(result).toStrictEqual('test-it.md');
    result = simpleSlug('???--!!  test  ..  i? · t....md???  ---++__!!');
    expect(result).toStrictEqual('test-i-t.md');
    result = simpleSlug('???--!!  test  ..  i? · t   .md');
    expect(result).toStrictEqual('test-i-t-md');
  });
});

describe('trimFilename', () => {
  it('should filter multi whitespace or dot...', () => {
    let result = trimFilename('  test --–-- ..  it....?md.');
    expect(result).toStrictEqual('test-it.md');
    result = trimFilename('???--!!  test  ..  i? · t....md???  ---++__!!');
    expect(result).toStrictEqual('test-i-t.md');
    result = trimFilename('???--!!  test  ..  i? · t   -.md');
    expect(result).toStrictEqual('test-i-t.md');
  });
});
