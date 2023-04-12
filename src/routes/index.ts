import { Router } from 'express';
import { UserRouter } from './users-routes';

export class MainRouter {
  protected router: Router;

  constructor() {
    this.router = Router();
    this.loadRoutes();
  }

  private loadRoutes(): void {
    const userRuter = new UserRouter();
    this.router.use('/users', userRuter.getRouter());
  }

  public getRouter(): Router {
    return this.router;
  }
}
