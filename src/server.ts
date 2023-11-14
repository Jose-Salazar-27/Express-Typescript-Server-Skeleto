import express from "express";
import "reflect-metadata";
import { inject, injectable } from "inversify";
import { MainRouter } from "./routes";
import { ServerConfig } from "./config/server-config";
import { loadDependencies, middlewares } from "./config/load-server-middlwares";
import { IRouter, IServer } from "./dependency-injection";
import { TYPES } from "./shared/constants/identifiers";

@injectable()
export class Server extends ServerConfig implements IServer {
  public app: express.Application;
  public readonly router: IRouter;
  private port;
  private server: any;

  constructor(@inject(TYPES.Router) _router: MainRouter) {
    super();
    this.app = express();
    this.router = _router;
    this.port = this.getEnvVar("PORT");
    this.loadRoutes();
    loadDependencies(this.app, middlewares);
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
    this.app.use("/api", this.router.getRouter());
  }

  getApp() {
    return this.app;
  }
}
