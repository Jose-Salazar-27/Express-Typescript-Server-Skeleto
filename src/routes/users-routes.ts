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
    this.router.get('/', (req, res) => this.controller.validateTest(req, res));
    this.router.get('/user', (req, res) => this.controller.searchUser(req, res));
    this.router.post('/user', (req, res) => this.controller.uploadUser(req, res));
  }

  public getRouter(): Router {
    return this.router;
  }
}
