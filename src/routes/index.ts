import { Router } from 'express';
import { UserRouter } from './users-routes';
import { AuthRouter } from './auth-routes';

export class MainRouter {
  protected router: Router;

  constructor() {
    this.router = Router();
    this.loadRoutes();
  }

  private loadRoutes(): void {
    const userRuter = new UserRouter();
    const authRouter = new AuthRouter();

    this.router.use('/users', userRuter.getRouter());
    this.router.use('/auth', authRouter.getRouter());
  }

  public getRouter(): Router {
    return this.router;
  }
}
