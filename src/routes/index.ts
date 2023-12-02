import { Router } from "express";
import { inject, injectable } from "inversify";
import { AuthRouter } from "./auth-routes";
import { IRouter, IUserRouter } from "../dependency-injection";
import { TYPES } from "../shared/constants/identifiers";

@injectable()
export class MainRouter implements IRouter {
  public router: Router;

  constructor(
    @inject(TYPES.UserRotuer) _userRouter: IUserRouter,
    @inject(TYPES.Auth.router) _authRouter: AuthRouter
  ) {
    this.router = Router();
    this.loadRoutes(_userRouter, _authRouter);
  }

  public loadRoutes(_userRouter: IUserRouter, authRouter: AuthRouter): void {
    const userRuter = _userRouter;
    // const authRouter = authRouter;

    this.router.use("/users", userRuter.getRouter());
    this.router.use("/auth", authRouter.getRouter());
  }

  public getRouter(): Router {
    return this.router;
  }
}
