import type { Router } from "express";
import type { IUserController } from "./controller-interfaces";
import type { Authorizer } from "../../middleware/authorizer";
import { IAuthorizer } from "./middleware-interfaces";

export interface IRouter {
  readonly router: Router;
  loadRoutes(_userRouter: IUserRouter): void;
  getRouter(): Router;
}

export interface IUserRouter {
  router: Router;
  controller: IUserController;
  middleware: IAuthorizer;
  initRoutes(): void;
  getRouter(): Router;
}
