import { Router } from 'express';
import { BaseRouter } from '../models/router-model';
import { UserController } from '../controllers/user-controllers';
import { Authorizer } from '../middleware/authorizer';

export class UserRouter {
  protected router: Router;
  protected controller: UserController;
  protected middleware: Authorizer;

  constructor() {
    this.router = Router();
    this.controller = new UserController();
    this.middleware = new Authorizer();
    this.initRoutes();
  }

  protected initRoutes(): void {
    // this.router.get('/messages', (req, res) => this.controller.getPosts(req, res));
    this.router.get(
      '/role',
      (req, res, next) => this.middleware.authorize(req, res, next),
      (req, res) => this.controller.getUserRole(req, res)
    );
    this.router.post(
      '/messages',
      (req, res, next) => this.middleware.authorize(req, res, next),
      (req, res) => this.controller.messagesByRole(req, res)
    );
    this.router.get('/giveaways/:level', (req, res) => this.controller.getGiveAways(req, res));
  }

  public getRouter(): Router {
    return this.router;
  }
}
