import express, { Router } from 'express';
import * as dotenv from 'dotenv';
import { MainRouter } from './routes';
import { ServerConfig } from './config/server-config';

export class Server extends ServerConfig {
  public app: express.Application;
  private router;
  private port;
  private server: any;

  constructor() {
    super();
    this.app = express();
    this.router = new MainRouter();
    this.port = this.getEnvVar('PORT');
    this.loadRoutes();
  }

  public start() {
    this.server = this.app.listen(this.port, () => {
      console.log(`Server started on port ${this.port}`);
    });
  }

  stop() {
    this.server.close();
  }

  protected loadRoutes() {
    this.app.use('/api', this.router.getRouter());
  }

  setPort() {
    this.port = '3001';
  }

  getApp() {
    return this.app;
  }
}
