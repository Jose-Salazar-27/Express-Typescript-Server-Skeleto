import type { Application } from "express";
import type { IRouter } from "./routers-interfaces";

export interface IServer {
  app: Application;
  readonly router: IRouter;
}
