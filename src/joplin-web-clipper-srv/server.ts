import { defaultsDeep } from 'lodash';
import Hapi, { ServerOptions } from '@hapi/hapi';
import plgPulse from 'hapi-pulse';
import laabr from 'laabr';
import { createApi } from './api';

export interface IServerOptions extends ServerOptions {
  timeout?: number;
  logger?: any;
  signals?: string[];
  postServerStop?: Function;
  preServerStop?: Function;
  preShutdown?: Function;
  log?: any;
}

export async function createJoplinWebClipperServer(options?: IServerOptions) {
  options = defaultsDeep({}, options, {
    state: {
      ignoreErrors: true,
      strictHeader: false,
    },
    port: 41184,
    host: 'localhost',
    timeout: 15000,
    routes: {
      payload: {
        maxBytes: 1073741824,
      },
    },
  }) as IServerOptions;
  const timeout = options.timeout;
  const logOptions = Object.assign(
    {
      formats: {
        // onPostStart: 'server.info',
        response:
          ':time :method :remoteAddress :url :status (:responseTime ms)',
        log: false,
      },
      // tokens: { start: () => '[start]' },
      // indent: 2,
      // colored: true,
    },
    options.log
  );
  delete options.log;
  delete options.timeout;
  const server = Hapi.server(options);
  const api = await createApi();
  if (typeof timeout === 'number') options.timeout = timeout;

  // hapi plugin to gracefully stop your hapi server
  await server.register({
    plugin: plgPulse,
    options,
  });

  await server.register({
    plugin: laabr,
    options: logOptions,
  });

  server.route({
    method: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    path: '/{path*}',
    handler: (req, h) =>
      api.handleRequest(
        {
          method: req.method,
          path: req.path,
          body: req.payload,
          query: req.query,
          headers: req.headers,
        },
        req,
        h
      ),
  });
  return server;
}
