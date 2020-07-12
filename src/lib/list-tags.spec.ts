import path from 'path';
import { getTags } from './list-tags';

describe('list-tags', () => {
  it('getTags via default options', async () => {
    const root = path.join(__dirname, '../../test/fixture');
    const result = await getTags(root);
    expect(result).toMatchInlineSnapshot(`
      Array [
        "readme",
        "intro",
      ]
    `);
  });
});
