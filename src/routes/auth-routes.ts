import { Router } from 'express';
import { BaseRouter } from '../models/router-model';
import { AuthController } from '../controllers/auth-controllers';

export class AuthRouter {
  protected router: Router;
  protected controller: AuthController;

  constructor() {
    this.router = Router();
    this.controller = new AuthController();
    this.initRoutes();
  }

  protected initRoutes(): void {
    this.router.get('/discord', (req, res) => this.controller.discord(req, res));
    this.router.get('/discord/callback', (req, res) => this.controller.discordCallback(req, res));
    this.router.get('/user', (req, res) => this.controller.user(req, res));
  }

  public getRouter(): Router {
    return this.router;
  }
}

