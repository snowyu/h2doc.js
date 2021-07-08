import Debug from 'debug';
import { Request, ResponseToolkit } from '@hapi/hapi';
import OpenAPIBackend, { Context } from 'openapi-backend';
import path from 'path';
import { getConfigValue } from '../lib/get-md-config';
import { htmlToMarkdown, IInputOptions } from '../lib/html-to-markdown';
import { getFolders } from '../lib/list-dirs';
import { getTags } from '../lib/list-tags';

const debug = Debug('h2doc:api');

// create api with your definition file or object
export async function createApi() {
  const api = new OpenAPIBackend({
    definition: path.resolve(__dirname, '../../config/joplin-web-clipper.yaml'),
  });

  api.register({
    async listFolders(c: Context, req: Request, h: ResponseToolkit) {
      const dirs = await getFolders();
      const root = (await getConfigValue('output.root')) as string;
      dirs.unshift(root);

      const result = dirs.map(dir => {
        return {
          id: dir,
          title: '/' + path.relative(root, dir),
        };
      });
      debug('listFolders:', result);
      return (result);
    },
    async listTags(c: Context, req: Request, h: ResponseToolkit) {
      const tags = await getTags();
      debug('listTags:', tags);

      return (
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
        body: body.body!,
        tags: body.tags ? body.tags.split(',') : '',
        url: body.source_url,
      };
      const htmlType = body.source_command;
      if (htmlType) {
        // htmlType.preProcessFor = 'html' | 'markdown'
        input.htmlType =
          typeof htmlType === 'string' ? htmlType : htmlType.name;
      }

      debug('note creating:', body.parent_id, body?.title);
      await htmlToMarkdown(input);
      debug('note created');
      return (body);
    },
    ping(c: Context, req: Request, h: ResponseToolkit) {
      return ('JoplinClipperServer');
    },
    notFound(c: Context, req: Request, h: ResponseToolkit) {
      // h.response().code(404)
      h.response({ err: 'not found' }).code(404);
      return { err: 'not found' }
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
