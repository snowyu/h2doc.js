import { Request, ResponseToolkit } from '@hapi/hapi';
import OpenAPIBackend, { Context } from 'openapi-backend';
import path from 'path';
import { getConfigValue } from '../lib/get-md-config';
import { htmlToMarkdown, IInputOptions } from '../lib/html-to-markdown';
import { getFolders } from '../lib/list-dirs';
import { getTags } from '../lib/list-tags';

// create api with your definition file or object
export async function createApi() {
  const api = new OpenAPIBackend({
    definition: path.resolve(__dirname, '../../config/joplin-web-clipper.yaml'),
  });

  api.register({
    async listFolders(c: Context, req: Request, h: ResponseToolkit) {
      const dirs = await getFolders();
      const root = (await getConfigValue('output.root')) as string;

      const result = dirs.map(dir => {
        return {
          id: dir,
          title: path.relative(root, dir),
        };
      });
      req.log('read', result);

      return h.response(result);
    },
    async listTags(c: Context, req: Request, h: ResponseToolkit) {
      const tags = await getTags();
      req.log('read', tags);

      return h.response(
        tags.map(id => ({
          id,
          title: id,
        }))
      );
    },
    // listNotes(c: Context, req: Request, h: ResponseToolkit) {},
    async createNote(c: Context, req: Request, h: ResponseToolkit) {
      const body = c.request.body;
      const input: IInputOptions = {
        title: body.title,
        folder: body.parent_id!,
        html: body.body_html!,
        tags: body.tags ? body.tags.split(',') : '',
        url: body.source_url,
      };
      req.log('write', 'before');
      await htmlToMarkdown(input);
      req.log('write', 'done');
      return h.response(body);
    },
    ping(c: Context, req: Request, h: ResponseToolkit) {
      return h.response('JoplinClipperServer');
    },
    notFound(c: Context, req: Request, h: ResponseToolkit) {
      h.response({ err: 'not found' }).code(404);
    },
  });

  // api.registerSecurityHandler('ApiKey', (c) => {
  //   const authorized = c.request.headers['x-api-key'] === 'SuperSecretPassword123';
  //   // truthy return values are interpreted as auth success
  //   // you can also add any auth information to the return value
  //   return authorized;
  // });

  // initialize the backend
  await api.init();
  return api;
}
// export default api;
