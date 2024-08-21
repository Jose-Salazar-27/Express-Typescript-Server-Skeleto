import express from 'express';
import { inject, injectable } from 'inversify';
import type { Server as HttpServer } from 'http';
import { MainRouter } from './routes';
import { ServerConfig } from './config/server-config';
import { IRouter, IServer } from './dependency-injection';
import { TYPES } from './shared/constants/identifiers';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bearerToken from 'express-bearer-token';
import morgan from 'morgan';
import ErrorHandler, { AxiomTracking } from './middleware/error-handler';

@injectable()
export class Server extends ServerConfig implements IServer {
  public app: express.Application;
  public readonly router: IRouter;
  private port;
  private server?: HttpServer;

  constructor(@inject(TYPES.Router) _router: MainRouter) {
    super();
    this.app = express();
    // for producction
    // this.app.use(cors({ origin: 'https://tiento-demo.vercel.app' }));

    // for local dev
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(bearerToken());
    this.app.use(express.urlencoded({ extended: true }));
    this.router = _router;
    this.port = this.getEnvVar('PORT');
    this.app.use(morgan('combined'));
    this.loadRoutes();
    this.app.use(ErrorHandler);
    this.app.use(AxiomTracking);
  }

  public start() {
    this.server = this.app.listen(this.port, () => {
      console.log(`Server started on port ${this.port}`);
    });

    this.app._router.stack.forEach(print.bind(null, []));
  }

  stop() {
    this.server!.close();
  }

  protected loadRoutes() {
    this.app.use('/api', this.router.getRouter());
  }

  getApp() {
    return this.app;
  }
}

function print(path: any, layer: any) {
  if (layer.route) {
    layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))));
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))));
  } else if (layer.method) {
    console.log('%s /%s', layer.method.toUpperCase(), path.concat(split(layer.regexp)).filter(Boolean).join('/'));
  }
}

function split(thing: any) {
  if (typeof thing === 'string') {
    return thing.split('/');
  } else if (thing.fast_slash) {
    return '';
  } else {
    var match = thing
      .toString()
      .replace('\\/?', '')
      .replace('(?=\\/|$)', '$')
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
    return match ? match[1].replace(/\\(.)/g, '$1').split('/') : '<complex:' + thing.toString() + '>';
  }
}
