import { Router } from "express";
import { inject, injectable } from "inversify";
import { UserRouter } from "./users-routes";
import { AuthRouter } from "./auth-routes";
import { IRouter, IUserRouter } from "../dependency-injection";
import { TYPES } from "../shared/constants/identifiers";

@injectable()
export class MainRouter implements IRouter {
  public router: Router;

  constructor(@inject(TYPES.UserRotuer) _userRouter: IUserRouter) {
    this.router = Router();
    this.loadRoutes(_userRouter);
  }

  public loadRoutes(_userRouter: IUserRouter): void {
    const userRuter = _userRouter;
    const authRouter = new AuthRouter();

    this.router.use("/users", userRuter.getRouter());
    this.router.use("/auth", authRouter.getRouter());
  }

  public getRouter(): Router {
    return this.router;
  }
}
