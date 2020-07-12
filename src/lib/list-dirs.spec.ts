import path from 'path';
import { listDirs } from './list-dirs';

describe('list-dirs', () => {
  it('list dir ignore markdown', async () => {
    const root = path.join(__dirname, '../../test/fixture');
    const result = (
      await listDirs({
        root,
      })
    ).map(p => path.relative(root, p));
    expect(result).toMatchInlineSnapshot(`
      Array [
        "sub1",
        "sub1/sub1-2",
        "sub2",
      ]
    `);
  });
});
