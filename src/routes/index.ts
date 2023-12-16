import { Router } from "express";
import { inject, injectable } from "inversify";
import { AuthRouter } from "./auth-routes";
import { IRouter, IUserRouter } from "../dependency-injection";
import { TYPES } from "../shared/constants/identifiers";
import { SocialMediaRouter } from "./social-media.routes";

@injectable()
export class MainRouter implements IRouter {
  public router: Router;

  constructor(
    @inject(TYPES.UserRotuer) _userRouter: IUserRouter,
    @inject(TYPES.Auth.router) _authRouter: AuthRouter,
    @inject(TYPES.Social_Media.router) _socialRouter: SocialMediaRouter
  ) {
    this.router = Router();
    this.loadRoutes(_userRouter, _authRouter, _socialRouter);
  }

  public loadRoutes(
    _userRouter: IUserRouter,
    authRouter: AuthRouter,
    socialRouter: SocialMediaRouter
  ): void {
    const userRuter = _userRouter;

    this.router.use("/users", userRuter.getRouter());
    this.router.use("/auth", authRouter.getRouter());
    this.router.use("/community", socialRouter.getRouter());
  }

  public getRouter(): Router {
    return this.router;
  }
}
