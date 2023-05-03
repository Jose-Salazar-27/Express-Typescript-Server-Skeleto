import { Router } from 'express';
import { BaseRouter } from '../models/router-model';
import { UserController } from '../controllers/user-controllers';

export class UserRouter {
  protected router: Router;
  protected controller: UserController;

  constructor() {
    this.router = Router();
    this.controller = new UserController();
    this.initRoutes();
  }

  protected initRoutes(): void {
    // this.router.get('/messages', (req, res) => this.controller.getPosts(req, res));
    this.router.get('/role', (req, res) => this.controller.getUserRole(req, res));
    this.router.get('/messages', (req, res) => this.controller.messagesByRole(req, res));
    this.router.get('/giveaways', (req, res) => this.controller.getGiveAways(req, res));
  }

  public getRouter(): Router {
    return this.router;
  }
}
