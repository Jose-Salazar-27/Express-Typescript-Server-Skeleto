import { Router } from "express";
import { inject, injectable } from "inversify";
import { IAuthorizer, IUserController } from "../dependency-injection";
import { TYPES } from "../shared/constants/identifiers";

@injectable()
export class UserRouter {
  public router: Router;
  public controller: IUserController;
  public middleware: IAuthorizer;

  constructor(
    @inject(TYPES.UserController) _userController: IUserController,
    @inject(TYPES.Authorizer) _middleware: IAuthorizer
  ) {
    this.router = Router();
    this.controller = _userController;
    this.middleware = _middleware;
    this.initRoutes();
  }

  public initRoutes(): void {
    // this.router.get('/messages', (req, res) => this.controller.getPosts(req, res));
    this.router.get(
      "/role",
      (req, res, next) => this.middleware.authorize(req, res, next),
      (req, res) => this.controller.getUserRole(req, res)
    );
    this.router.post(
      "/messages",
      (req, res, next) => this.middleware.authorize(req, res, next),
      (req, res) => this.controller.messagesByRole(req, res)
    );
    this.router.get("/giveaways/:level", (req, res) =>
      this.controller.getGiveAways(req, res)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
