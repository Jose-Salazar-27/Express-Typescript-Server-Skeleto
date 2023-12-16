import type { Router } from "express";
import type { IUserController } from "./controller-interfaces";
import type { Authorizer } from "../../middleware/authorizer";
import { IAuthorizer } from "./middleware-interfaces";
import { AuthRouter } from "../../routes/auth-routes";
import { SocialMediaRouter } from "../../routes/social-media.routes";

export interface IRouter {
  readonly router: Router;
  loadRoutes(
    _userRouter: IUserRouter,
    authRouter: AuthRouter,
    socialRouter: SocialMediaRouter
  ): void;
  getRouter(): Router;
}

export interface IUserRouter {
  router: Router;
  controller: IUserController;
  middleware: IAuthorizer;
  initRoutes(): void;
  getRouter(): Router;
}
