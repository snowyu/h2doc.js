import Hapi, { ServerOptions } from '@hapi/hapi';
import plgPulse from 'hapi-pulse';
import laabr from 'laabr';
import api from './api';

export interface IServerOptions extends ServerOptions {
  timeout?: number;
  logger?: any;
  signals?: string[];
  postServerStop?: Function;
  preServerStop?: Function;
  preShutdown?: Function;
}

export async function createJoplinWebClipperServer(
  options: IServerOptions = {
    port: 41184,
    host: 'localhost',
    timeout: 15000,
  }
) {
  const timeout = options.timeout;
  delete options.timeout;
  const server = Hapi.server(options);
  if (typeof timeout === 'number') options.timeout = timeout;

  // hapi plugin to gracefully stop your hapi server
  await server.register({
    plugin: plgPulse,
    options,
  });

  await server.register({
    plugin: laabr,
    options: {
      formats: {
        onPostStart: ':time :start :level :message',
        log: false,
      },
      // tokens: { start: () => '[start]' },
      indent: 0,
      colored: true,
    },
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
