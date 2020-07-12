import { simpleSlug } from './simple-slug';

describe('simpleSlug', () => {
  it('should filter multi whitespace or dot...', () => {
    let result = simpleSlug('  test --–-- ..  it....?md.');
    expect(result).toStrictEqual('test-it.md');
    result = simpleSlug('???--!!  test  ..  it....md???  ---++__!!');
    expect(result).toStrictEqual('test-it.md');
  });
});
